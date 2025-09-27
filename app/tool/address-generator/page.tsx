"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Navigation, RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface AddressData {
  addresses: string[];
  currentIndex: number;
  totalCount: number;
}

export default function AddressGeneratorPage() {
  const [ipAddress, setIpAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressData, setAddressData] = useState<AddressData>({
    addresses: [],
    currentIndex: 0,
    totalCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ip");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Paste from clipboard function
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (activeTab === "ip") {
        setIpAddress(text.trim());
      } else {
        setZipCode(text.trim());
      }
      toast.success("Pasted from clipboard");
    } catch (err) {
      toast.error("Cannot access clipboard");
    }
  };

  // Generate addresses from IP
  const generateFromIP = async () => {
    if (!ipAddress.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/address-generator/ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ipAddress.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        setAddressData({
          addresses: data.addresses,
          currentIndex: 0,
          totalCount: data.addresses.length
        });
        toast.success(`Found ${data.addresses.length} addresses`);
      } else {
        setAddressData({ addresses: [], currentIndex: 0, totalCount: 0 });
        toast.error(data.error || "Could not resolve IP address");
      }
    } catch (error) {
      toast.error("API call failed");
      setAddressData({ addresses: [], currentIndex: 0, totalCount: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate addresses from ZIP
  const generateFromZIP = async () => {
    if (!zipCode.trim()) {
      toast.error("Please enter a ZIP code");
      return;
    }

    if (!/^\d+$/.test(zipCode.trim())) {
      toast.error("ZIP code must be numeric only");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/address-generator/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: zipCode.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        setAddressData({
          addresses: data.addresses,
          currentIndex: 0,
          totalCount: data.addresses.length
        });
        toast.success(`Found ${data.addresses.length} addresses`);
      } else {
        setAddressData({ addresses: [], currentIndex: 0, totalCount: 0 });
        toast.error(data.error || "Could not resolve ZIP code");
      }
    } catch (error) {
      toast.error("API call failed");
      setAddressData({ addresses: [], currentIndex: 0, totalCount: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const showNext = () => {
    if (addressData.currentIndex < addressData.addresses.length - 1) {
      setAddressData(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }
  };

  const showPrevious = () => {
    if (addressData.currentIndex > 0) {
      setAddressData(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  };

  // Copy address to clipboard
  const copyAddress = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedIndex(index);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  // Copy specific address part
  const copyAddressPart = async (part: string, partName: string) => {
    try {
      await navigator.clipboard.writeText(part);
      toast.success(`${partName} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  // Reset function
  const reset = () => {
    setIpAddress("");
    setZipCode("");
    setAddressData({ addresses: [], currentIndex: 0, totalCount: 0 });
    toast.info("Reset successfully");
  };

  // Address parsing function
  const parseAddress = (address: string) => {
    const parts = address.split(', ');
    if (parts.length >= 4) {
      // Full address format: "123 Main St, New York, NY 10001, United States"
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[2];
      const country = parts[3];
      
      // Extract state and ZIP from "NY 10001" format
      const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
      const state = stateZipMatch ? stateZipMatch[1] : stateZip;
      const zip = stateZipMatch ? stateZipMatch[2] : '';
      
      return {
        street,
        city,
        state,
        zip,
        country,
        fullAddress: address
      };
    } else if (parts.length >= 3) {
      // Format: "123 Main St, New York, NY 10001"
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[2];
      
      const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
      const state = stateZipMatch ? stateZipMatch[1] : stateZip;
      const zip = stateZipMatch ? stateZipMatch[2] : '';
      
      return {
        street,
        city,
        state,
        zip,
        country: 'United States',
        fullAddress: address
      };
    }
    return {
      street: address,
      city: '',
      state: '',
      zip: '',
      country: '',
      fullAddress: address
    };
  };

  const currentAddress = addressData.addresses.length > 0 
    ? parseAddress(addressData.addresses[addressData.currentIndex])
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Address Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate real addresses from IP addresses or ZIP codes
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 min-h-[600px]">
          {/* Left Side - Input Section (2/5) */}
          <div className="xl:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="ip" className="text-sm">IP → Address</TabsTrigger>
                <TabsTrigger value="zip" className="text-sm">ZIP → Address</TabsTrigger>
              </TabsList>

              <TabsContent value="ip" className="space-y-0">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Generate from IP Address
                    </CardTitle>
                    <CardDescription>
                      Enter an IP address and get real addresses from that area
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="ip-input" className="text-sm font-medium">IP Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="ip-input"
                          placeholder="e.g., 8.8.8.8"
                          value={ipAddress}
                          onChange={(e) => setIpAddress(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={pasteFromClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={generateFromIP} 
                        disabled={isLoading || !ipAddress.trim()}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2" />
                        )}
                        Generate from IP
                      </Button>
                      <Button variant="outline" onClick={reset} className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="zip" className="space-y-0">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-green-500" />
                      Generate from ZIP Code
                    </CardTitle>
                    <CardDescription>
                      Enter a ZIP code and get random addresses from that area
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="zip-input" className="text-sm font-medium">ZIP Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="zip-input"
                          placeholder="e.g., 10001"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={pasteFromClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={generateFromZIP} 
                        disabled={isLoading || !zipCode.trim()}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2" />
                        )}
                        Generate from ZIP
                      </Button>
                      <Button variant="outline" onClick={reset} className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Output Section (3/5) */}
          <div className="xl:col-span-3">
            {addressData.addresses.length > 0 && currentAddress ? (
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Navigation className="h-6 w-6 text-purple-500" />
                        Found: {addressData.totalCount} addresses
                      </CardTitle>
                      <CardDescription className="text-base">
                        Address {addressData.currentIndex + 1} / {addressData.totalCount}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {activeTab === "ip" ? "From IP" : "From ZIP"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 h-full">
                  {/* Address Parts */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">Street Address</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddressPart(currentAddress.street, "Street Address")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-blue-900 dark:text-blue-100 font-medium">
                            {currentAddress.street}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">City</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddressPart(currentAddress.city, "City")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-green-900 dark:text-green-100 font-medium">
                            {currentAddress.city || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">State</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddressPart(currentAddress.state, "State")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-purple-900 dark:text-purple-100 font-medium">
                            {currentAddress.state || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ZIP Code and Country Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">ZIP Code</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddressPart(currentAddress.zip, "ZIP Code")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-orange-900 dark:text-orange-100 font-medium">
                            {currentAddress.zip || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddressPart(currentAddress.country, "Country")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          <p className="text-cyan-900 dark:text-cyan-100 font-medium">
                            {currentAddress.country || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Full Address */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">Full Address</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddressPart(currentAddress.fullAddress, "Full Address")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Alert className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <AlertDescription className="text-lg font-medium text-orange-900 dark:text-orange-100">
                          {currentAddress.fullAddress}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  {/* Navigation and Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={showPrevious}
                        disabled={addressData.currentIndex === 0}
                        className="flex items-center gap-2 flex-1 sm:flex-none"
                      >
                        <Navigation className="h-4 w-4 rotate-180" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={showNext}
                        disabled={addressData.currentIndex === addressData.addresses.length - 1}
                        className="flex items-center gap-2 flex-1 sm:flex-none"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="default"
                      onClick={() => copyAddress(currentAddress.fullAddress, addressData.currentIndex)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
                    >
                      {copiedIndex === addressData.currentIndex ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedIndex === addressData.currentIndex ? "Copied!" : "Copy All"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                    Enter input to see addresses
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Use the form on the left to enter an IP address or ZIP code and get real addresses
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
