# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The Python implementation of the GRPC helloworld.Greeter server."""

from concurrent import futures
import logging

import grpc
import helloworld_pb2
import helloworld_pb2_grpc
import time
import signal
import os

from pathlib import Path



class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        return helloworld_pb2.HelloReply(message="Hello, %s!" % request.name)
    def SayHelloStreamReply(self, request, context):
        for i in range(5):
            yield helloworld_pb2.HelloReply(message=f"Hello, {request.name}! {str(i+1)}")
            time.sleep(1)


def cleanup(port_file):
    if port_file.exists():
        port_file.unlink()
        print("Port file deleted.")
        
def signal_handler(signum, frame, port_file):
    print(f"Received signal {signum}, stopping server and cleaning up...")
    cleanup(port_file)
    os._exit(0)  # Use os._exit to exit immediately

def serve():

    
    # Get Documents Folder and write port to file
    home = Path.home()
    documents_path = home / 'Documents' / "app" 
    # Create the directory if it doesn't exist
    documents_path.mkdir(parents=True, exist_ok=True)



    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    port = server.add_insecure_port("[::]:0")
    port = str(port)
    server.start()
    print(f"Server started, listening on {port}")

        # Write port to file
    with open(documents_path / "port.txt", 'w') as f:
        f.write(port)

    port_file_path = documents_path / "port.txt"
    # Set up signal handlers
    signal.signal(signal.SIGINT, lambda signum, frame: signal_handler(signum, frame, port_file_path))
    signal.signal(signal.SIGTERM, lambda signum, frame: signal_handler(signum, frame, port_file_path))
    
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        # Handle Ctrl+C
        

        pass
    finally:
        cleanup(port_file_path)


if __name__ == "__main__":
    logging.basicConfig()
    serve()
