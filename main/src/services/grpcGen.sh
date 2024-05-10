#!/bin/bash

# Directories
OUT_DIR="./grpc"
PROTO_DIR="../../../protos/"

# Find global node_modules path and setup path to the protoc-gen-ts plugin
PROTOC_GEN_TS_PATH="$(npm root -g)/grpc_tools_node_protoc_ts/bin/protoc-gen-ts"

# Generate JavaScript and TypeScript code
grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:$OUT_DIR \
  --grpc_out=grpc_js:$OUT_DIR \
  --plugin=protoc-gen-ts=$PROTOC_GEN_TS_PATH \
  --ts_out=grpc_js:$OUT_DIR \
  --proto_path=$PROTO_DIR \
  $PROTO_DIR/helloworld.proto

echo "gRPC Node.js code generation completed."
