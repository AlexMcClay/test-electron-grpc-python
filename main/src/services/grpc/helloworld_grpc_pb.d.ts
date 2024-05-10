// package: helloworld
// file: helloworld.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as helloworld_pb from "./helloworld_pb";

interface IGreeterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sayHello: IGreeterService_ISayHello;
    sayHelloStreamReply: IGreeterService_ISayHelloStreamReply;
}

interface IGreeterService_ISayHello extends grpc.MethodDefinition<helloworld_pb.HelloRequest, helloworld_pb.HelloReply> {
    path: "/helloworld.Greeter/SayHello";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<helloworld_pb.HelloRequest>;
    requestDeserialize: grpc.deserialize<helloworld_pb.HelloRequest>;
    responseSerialize: grpc.serialize<helloworld_pb.HelloReply>;
    responseDeserialize: grpc.deserialize<helloworld_pb.HelloReply>;
}
interface IGreeterService_ISayHelloStreamReply extends grpc.MethodDefinition<helloworld_pb.HelloRequest, helloworld_pb.HelloReply> {
    path: "/helloworld.Greeter/SayHelloStreamReply";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<helloworld_pb.HelloRequest>;
    requestDeserialize: grpc.deserialize<helloworld_pb.HelloRequest>;
    responseSerialize: grpc.serialize<helloworld_pb.HelloReply>;
    responseDeserialize: grpc.deserialize<helloworld_pb.HelloReply>;
}

export const GreeterService: IGreeterService;

export interface IGreeterServer extends grpc.UntypedServiceImplementation {
    sayHello: grpc.handleUnaryCall<helloworld_pb.HelloRequest, helloworld_pb.HelloReply>;
    sayHelloStreamReply: grpc.handleServerStreamingCall<helloworld_pb.HelloRequest, helloworld_pb.HelloReply>;
}

export interface IGreeterClient {
    sayHello(request: helloworld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: helloworld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: helloworld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHelloStreamReply(request: helloworld_pb.HelloRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<helloworld_pb.HelloReply>;
    sayHelloStreamReply(request: helloworld_pb.HelloRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<helloworld_pb.HelloReply>;
}

export class GreeterClient extends grpc.Client implements IGreeterClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sayHello(request: helloworld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: helloworld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: helloworld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHelloStreamReply(request: helloworld_pb.HelloRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<helloworld_pb.HelloReply>;
    public sayHelloStreamReply(request: helloworld_pb.HelloRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<helloworld_pb.HelloReply>;
}
