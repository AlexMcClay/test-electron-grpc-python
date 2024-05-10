import { stub } from "@src/main";
import { HelloRequest } from "./grpc/helloworld_pb";

// make class for the service
export class PyLayerService {
  // define the service methods
  sayHello(name: string): Promise<string> {
    // make the request
    const req = new HelloRequest();
    req.setName(name);

    return new Promise((resolve, reject) => {
      if (stub) {
        console.time("sayHello");
        stub.sayHello(req, (err, response) => {
          if (err) {
            console.error(err);
            console.timeEnd("sayHello");

            reject(err);
          } else {
            console.timeEnd("sayHello");
            resolve(response.getMessage());
          }
        });
      } else {
        const error = new Error("stub is null");
        console.error(error);
        reject(error);
      }
    });
  }
}
