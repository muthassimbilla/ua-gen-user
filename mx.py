import tkinter as tk
from tkinter import ttk, messagebox
import requests
import random

# তোমার Mapbox Secret Token
MAPBOX_TOKEN = "sk.eyJ1IjoibXV0aGFzc2ltNCIsImEiOiJjbWcyaW5zOTgxMTRyMmtzOTQydDNjbzN1In0.GzRk_OFR53CrS2r6cspn-w"
BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"

# ---------------- API Functions ----------------
def ip_to_coords(ip):
    """IP → Coordinates (ipinfo.io)"""
    try:
        res = requests.get(f"https://ipinfo.io/{ip}/json", timeout=6)
        data = res.json()
        if "loc" in data:
            lat, lon = data["loc"].split(",")
            return float(lon), float(lat)  # Mapbox expects lon,lat
    except Exception as e:
        print("IP API Error:", e)
    return None

def zip_to_coords(zipcode):
    """ZIP → Random coordinate inside bounding box"""
    url = f"{BASE_URL}/{zipcode}.json"
    params = {"access_token": MAPBOX_TOKEN, "country": "US", "types": "postcode"}
    try:
        res = requests.get(url, params=params, timeout=6).json()
        if res.get("features"):
            bbox = res["features"][0].get("bbox")
            if bbox:
                minx, miny, maxx, maxy = bbox
                lon = random.uniform(minx, maxx)
                lat = random.uniform(miny, maxy)
                return lon, lat
    except Exception as e:
        print("ZIP API Error:", e)
    return None

def coords_to_addresses(coords, limit=5):
    """Coordinates → Multiple Addresses (Mapbox Reverse Geocoding)"""
    lon, lat = coords
    url = f"{BASE_URL}/{lon},{lat}.json"
    params = {"access_token": MAPBOX_TOKEN, "types": "address", "limit": limit}
    try:
        res = requests.get(url, params=params, timeout=6).json()
        addresses = []
        if res.get("features"):
            for feature in res["features"]:
                addresses.append(feature.get("place_name", ""))
        return addresses
    except Exception as e:
        print("Mapbox Error:", e)
    return []

# ---------------- Tkinter UI Class ----------------
class AddressTab:
    def __init__(self, parent, mode="ip"):
        self.parent = parent
        self.mode = mode
        self.addresses = []
        self.current_index = 0

        # Input
        label_text = "Enter IP address:" if mode == "ip" else "Enter ZIP code:"
        tk.Label(parent, text=label_text, font=("Arial", 12)).pack(pady=(10, 4))
        entry_frame = tk.Frame(parent)
        entry_frame.pack(pady=4)

        self.entry = tk.Entry(entry_frame, font=("Arial", 12), width=32, justify="center")
        self.entry.grid(row=0, column=0, padx=6)

        self.paste_btn = tk.Button(
            entry_frame, text="Paste", font=("Arial", 11),
            command=self.paste_from_clipboard
        )
        self.paste_btn.grid(row=0, column=1, padx=6)

        # Action buttons
        btn_frame = tk.Frame(parent)
        btn_frame.pack(pady=10)

        gen_text = "Generate from IP" if mode == "ip" else "Generate from ZIP"
        self.gen_btn = tk.Button(
            btn_frame, text=gen_text, command=self.generate,
            font=("Arial", 12), bg="#2563eb", fg="white"
        )
        self.gen_btn.grid(row=0, column=0, padx=10)

        self.reset_btn = tk.Button(
            btn_frame, text="Reset", command=self.reset,
            font=("Arial", 12), bg="#ef4444", fg="white"
        )
        self.reset_btn.grid(row=0, column=1, padx=10)

        # Info + Result
        self.count_label = tk.Label(parent, text="Found: 0 addresses", font=("Arial", 11))
        self.count_label.pack(pady=(6, 0))

        self.index_label = tk.Label(parent, text="", font=("Arial", 11, "italic"))
        self.index_label.pack(pady=(0, 6))

        self.result_label = tk.Label(parent, text="", font=("Arial", 12), wraplength=760, justify="center")
        self.result_label.pack(pady=16)

        # Navigation
        nav_frame = tk.Frame(parent)
        nav_frame.pack(pady=6)

        self.prev_btn = tk.Button(nav_frame, text="Previous", command=self.show_prev, state="disabled")
        self.prev_btn.grid(row=0, column=0, padx=20)

        self.next_btn = tk.Button(nav_frame, text="Next", command=self.show_next, state="disabled")
        self.next_btn.grid(row=0, column=1, padx=20)

    def paste_from_clipboard(self):
        try:
            value = self.parent.clipboard_get()
            self.entry.delete(0, tk.END)
            self.entry.insert(0, value.strip())
        except tk.TclError:
            messagebox.showwarning("Clipboard", "Clipboard is empty or not accessible.")

    def generate(self):
        query = self.entry.get().strip()
        if not query:
            messagebox.showwarning("Invalid input", "Please enter a valid input.")
            return

        coords = None
        if self.mode == "ip":
            coords = ip_to_coords(query)
        else:
            if not query.isdigit():
                messagebox.showwarning("Invalid ZIP", "ZIP code must be numeric.")
                return
            coords = zip_to_coords(query)

        if not coords:
            self.addresses = []
            self.update_labels()
            self.result_label.config(text="❌ Could not resolve input", fg="red")
            self.prev_btn.config(state="disabled")
            self.next_btn.config(state="disabled")
            return

        self.addresses = coords_to_addresses(coords, limit=5)
        if not self.addresses:
            self.update_labels()
            self.result_label.config(text="❌ No addresses found", fg="red")
            self.prev_btn.config(state="disabled")
            self.next_btn.config(state="disabled")
            return

        self.show_address(0)

    def update_labels(self):
        self.count_label.config(text=f"Found: {len(self.addresses)} addresses")
        if self.addresses:
            self.index_label.config(text=f"Address {self.current_index+1} of {len(self.addresses)}")
        else:
            self.index_label.config(text="")

    def show_address(self, index):
        self.current_index = index
        self.result_label.config(text=self.addresses[self.current_index], fg="green")
        self.update_labels()
        self.prev_btn.config(state="normal" if self.current_index > 0 else "disabled")
        self.next_btn.config(state="normal" if self.current_index < len(self.addresses) - 1 else "disabled")

    def show_next(self):
        if self.current_index < len(self.addresses) - 1:
            self.show_address(self.current_index + 1)

    def show_prev(self):
        if self.current_index > 0:
            self.show_address(self.current_index - 1)

    def reset(self):
        self.entry.delete(0, tk.END)
        self.result_label.config(text="")
        self.addresses = []
        self.current_index = 0
        self.update_labels()
        self.prev_btn.config(state="disabled")
        self.next_btn.config(state="disabled")

# ---------------- Main App ----------------
if __name__ == "__main__":
    root = tk.Tk()
    root.title("IP & ZIP → Address Generator (Mapbox)")
    root.geometry("900x520")

    notebook = ttk.Notebook(root)
    notebook.pack(expand=True, fill="both")

    ip_tab = tk.Frame(notebook)
    zip_tab = tk.Frame(notebook)

    notebook.add(ip_tab, text="IP → Address")
    notebook.add(zip_tab, text="ZIP → Address")

    AddressTab(ip_tab, mode="ip")
    AddressTab(zip_tab, mode="zip")

    root.mainloop()
