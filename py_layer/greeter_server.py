from concurrent import futures
import logging
import argparse


import grpc
import helloworld_pb2
import helloworld_pb2_grpc
import time

from pathlib import Path

class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        return helloworld_pb2.HelloReply(message="Hello, %s!" % request.name)
    def SayHelloStreamReply(self, request, context):
        for i in range(5):
            yield helloworld_pb2.HelloReply(message=f"Hello, {request.name}! {str(i+1)}")
            time.sleep(1)      


def serve(port):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"Server started, listening on {port}")
    server.wait_for_termination()
        


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='gRPC server port')
    parser.add_argument('port', type=int, help='The port the gRPC server should listen on')
    args = parser.parse_args()
    logging.basicConfig()
    serve(args.port)
