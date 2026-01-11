class User {
    constructor({ id, username, email, password, role, xp, level, skills }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role || "user";
        this.xp = xp || 0;
        this.level = level || 1;
        this.skills = skills || [];
        this.createdAt = new Date();
    }
}
module.exports = User;