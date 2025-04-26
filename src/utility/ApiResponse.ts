type ResponseType = "null" | "chat" | "join" | "create";

class ApiResponse {
   
    statusCode:number;
    data: any;
    message:string;
    success:boolean;
    type:ResponseType;

    constructor(statusCode:number,data:any,message:string,success:boolean = false,type:ResponseType){
        this.statusCode = statusCode;
        this.data = data;
        this.success = success;
        this.message = message;
        this.type = type;
    }
};
export default ApiResponse;

