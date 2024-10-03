"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, AlertCircle, Clock, Database, HardDrive, List, RefreshCw } from "lucide-react"
import { useEffect, useState } from 'react'
import { Bar, BarChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Mock data - replace with actual API calls to Elasticsearch
const mockIndices = [
  { name: "users", docsCount: 1000000, size: "1.2GB", health: "green" },
  { name: "products", docsCount: 500000, size: "800MB", health: "yellow" },
  { name: "orders", docsCount: 2000000, size: "2.5GB", health: "green" },
]

const mockUnassignedShards = [
  { index: "users", shard: 2, reason: "NODE_LEFT" },
  { index: "products", shard: 1, reason: "CLUSTER_RECOVERED" },
]

const mockClusterHealth = {
  status: "yellow",
  nodeCount: 3,
  unassignedShards: 2,
  activePrimaryShards: 10,
  activeShards: 20,
  relocatingShards: 1,
  initializingShards: 0,
  delayedUnassignedShards: 0,
}

const mockNodeHealth = [
  { name: "node-1", status: "green", cpu: 30, memory: 60, disk: 40, shards: 7 },
  { name: "node-2", status: "green", cpu: 25, memory: 55, disk: 35, shards: 8 },
  { name: "node-3", status: "yellow", cpu: 80, memory: 90, disk: 75, shards: 5 },
]

const mockShardDistribution = [
  { name: 'Primary Shards', count: 10 },
  { name: 'Replica Shards', count: 10 },
  { name: 'Unassigned Shards', count: 2 },
]

const mockClusterPerformance = [
  { time: '00:00', queryRate: 100, indexingRate: 50 },
  { time: '01:00', queryRate: 120, indexingRate: 60 },
  { time: '02:00', queryRate: 80, indexingRate: 40 },
  { time: '03:00', queryRate: 150, indexingRate: 70 },
  { time: '04:00', queryRate: 90, indexingRate: 55 },
]

export function ElasticsearchDashboardComponent() {
  const [indices, setIndices] = useState(mockIndices)
  const [unassignedShards, setUnassignedShards] = useState(mockUnassignedShards)
  const [clusterHealth, setClusterHealth] = useState(mockClusterHealth)
  const [nodeHealth, setNodeHealth] = useState(mockNodeHealth)
  const [shardDistribution, setShardDistribution] = useState(mockShardDistribution)
  const [clusterPerformance, setClusterPerformance] = useState(mockClusterPerformance)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    // Simulate API calls
    setTimeout(() => {
      // In a real application, you would fetch fresh data from Elasticsearch here
      setIsRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    // Initial data fetch
    refreshData()
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Elasticsearch Health Dashboard</h1>
        <Button onClick={refreshData} disabled={isRefreshing}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" />
              Cluster Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge variant={clusterHealth.status === "green" ? "secondary" : "default"}>
                  {clusterHealth.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span>{clusterHealth.nodeCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Shards:</span>
                <span>{clusterHealth.activeShards}</span>
              </div>
              <div className="flex justify-between">
                <span>Relocating Shards:</span>
                <span>{clusterHealth.relocatingShards}</span>
              </div>
              <div className="flex justify-between">
                <span>Initializing Shards:</span>
                <span>{clusterHealth.initializingShards}</span>
              </div>
              <div className="flex justify-between">
                <span>Unassigned Shards:</span>
                <span>{clusterHealth.unassignedShards}</span>
              </div>
              <div className="flex justify-between">
                <span>Delayed Unassigned Shards:</span>
                <span>{clusterHealth.delayedUnassignedShards}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2" />
              Shard Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={shardDistribution}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  <div className="flex w-full gap-2">
    <Card className="basis-1/2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2" />
            Unassigned Shards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Shard</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unassignedShards.map((shard, index) => (
                <TableRow key={index}>
                  <TableCell>{shard.index}</TableCell>
                  <TableCell>{shard.shard}</TableCell>
                  <TableCell>{shard.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="basis-1/2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <List className="mr-2" />
            Indices Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Document Count</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indices.map((index) => (
                <TableRow key={index.name}>
                  <TableCell>{index.name}</TableCell>
                  <TableCell>
                    <Badge variant={index.health === "green" ? "secondary" : "default"}>
                      {index.health}
                    </Badge>
                  </TableCell>
                  <TableCell>{index.docsCount.toLocaleString()}</TableCell>
                  <TableCell>{index.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
</div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2" />
            Cluster Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clusterPerformance}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="queryRate" stroke="#8884d8" name="Query Rate" />
              <Line type="monotone" dataKey="indexingRate" stroke="#82ca9d" name="Indexing Rate" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="mr-2" />
            Node Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Disk</TableHead>
                <TableHead>Shards</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodeHealth.map((node) => (
                <TableRow key={node.name}>
                  <TableCell>{node.name}</TableCell>
                  <TableCell>
                    <Badge variant={node.status === "green" ? "secondary" : "default"}>
                      {node.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={node.cpu} className="w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Progress value={node.memory} className="w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Progress value={node.disk} className="w-[60px]" />
                  </TableCell>
                  <TableCell>{node.shards}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}