const BASE_URL = "https://your-api.com"; // Replace with your backend

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
};

export const validateEntry = async (qrData: string, visitorCount: string) => {
    const res = await fetch(`${BASE_URL}/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData, visitorCount }),
    });
    return res.json();
};

export const logExit = async (qrData: string) => {
    const res = await fetch(`${BASE_URL}/exit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData }),
    });
    return res.json();
};

export const giveGift = async (qrData: string) => {
    const res = await fetch(`${BASE_URL}/gift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData }),
    });
    return res.json();
};

export const checkFoodStatus = async (qrData: string) => {
    const res = await fetch(`${BASE_URL}/food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData }),
    });
    return res.json();
};
