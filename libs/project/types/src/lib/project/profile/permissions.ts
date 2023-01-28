export interface Permissions {
    Permissions: string[]; // ['owner', 'write'];
    isOwner: boolean;
    writable: boolean;
    user: string;

    // constructor() {
    //     this.Permissions = ['owner', 'write'];
    //     this.isOwner = true;
    //     this.writable = true;
    //     this.user = '';
    // }
    // loadGraphJson(json) {
    //   if (json == null) {
    //     return;
    //   }
    //     if (json.Permissions != null) { this.Permissions = json.Permissions; }
    //     if (json.isOwner != null) { this.isOwner = json.isOwner; }
    //     if (json.writable != null) { this.writable = json.writable; }
    //     if (json.user != null) { this.user = json.user; }
    // }
}
