import { QueryParamsType } from "../types/query-params.type";

export class UrlManager {
    public static getQueryParams(): QueryParamsType {
        const qs: string = document.location.hash.split('+').join(' ');
        let params: QueryParamsType = {},
            tokens: RegExpExecArray | null,
            re: RegExp = /[?&]([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            if(tokens){
                params[decodeURIComponent(tokens[1] as string)] = decodeURIComponent(tokens[2] as string);
            }
       
        }
        return params;
    }

    //  public static checkUserData(params: QueryParamsType): void {
    //     if (!params.name || !params.lastName || !params.email) {
    //         location.href = '#/';
    //     }
    // };

}