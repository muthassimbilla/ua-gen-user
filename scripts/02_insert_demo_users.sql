-- Insert demo users with hashed passwords
-- Password for all demo users: "demo123456"
-- Hash generated using bcrypt with salt rounds 12

INSERT INTO users (full_name, telegram_username, password_hash) VALUES
(
    'আহমেদ রহমান',
    'ahmed_rahman',
    '$2b$12$LQv3c1yqBwEHxyyecPFAiOHSTRF.cp.9e0isHbgpVsIQElFqisASW'
),
(
    'ফাতিমা খাতুন',
    'fatima_khatun',
    '$2b$12$LQv3c1yqBwEHxyyecPFAiOHSTRF.cp.9e0isHbgpVsIQElFqisASW'
),
(
    'মোহাম্মদ করিম',
    'mohammad_karim',
    '$2b$12$LQv3c1yqBwEHxyyecPFAiOHSTRF.cp.9e0isHbgpVsIQElFqisASW'
);

-- Verify the inserted data
SELECT 
    id,
    full_name,
    telegram_username,
    created_at
FROM users
ORDER BY created_at DESC;
