const decodeTokenPayload = (token) => {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;

    try {
        const payloadBase64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
    } catch (error) {
        return null;
    }
};

const getCurrentUserRole = () => {
    const token = localStorage.getItem("token");
    const payload = decodeTokenPayload(token);
    if (!payload || typeof payload.role !== "string") return null;
    return payload.role.trim().toLowerCase();
};

const isAdminUser = () => getCurrentUserRole() === "admin";

const isModUser = () => getCurrentUserRole() === "mod";

const isStaffUser = () => {
    const role = getCurrentUserRole();
    return role === "admin" || role === "mod";
};

export {
    decodeTokenPayload,
    getCurrentUserRole,
    isAdminUser,
    isModUser,
    isStaffUser,
};
