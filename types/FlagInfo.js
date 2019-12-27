module.exports = class FlagInfo {
    constructor({name, argumented, description, permissionLevel}) {
        this.name = name || null;
        if(!name) {
            throw new Error("Name is a required argument that is missing.");
        }
        this.argumented = argumented || false;
        if(!argumented) {
            console.warn("Missing argumented argument for flag " + this.name)
        }
        this.description = description || "No description provided."
        this.permissionLevel = permissionLevel || 'owner'
    }
}