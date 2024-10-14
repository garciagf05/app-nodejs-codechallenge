#!/bin/bash
set -e

cub kafka-ready -b kafka:29092 1 20

kafka-topics --create --topic pendingQueue --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1
kafka-topics --create --topic validatedQueue --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1