import { Injectable } from "@angular/core";
import { ColorView } from "../../../../models/project/resource/resource";
import { Serializer } from "../../serializer";

@Injectable({
    providedIn: 'root',
})
export class ColorViewSerializerService implements Serializer<ColorView> {
    public fromJson(json?: any): ColorView {
        json = json ?? {};
        const obj: ColorView = {
            color: json?.color ?? 'white',
            backgroundcolor: json?.backgroundcolor ?? 'black',
        };
        return obj;
    }
    toJson(obj: ColorView): any {}

}
