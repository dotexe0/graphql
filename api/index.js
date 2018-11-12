const { ApolloServer, PubSub } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')
const express = require('express')

const lifts = require('./data/lifts.json')
const trails = require('./data/trails.json')

const pubsub = new PubSub()

// an object to be shared by all resolvers
const context = { lifts, trails, pubsub } 

const typeDefs = `
    type Lift {
        id: ID!
        name: String!
        status: LiftStatus!
        capacity: Int!
        night: Boolean!
        elevationGain: Int!
        trailAccess: [Trail!]!
    }

    type Trail {
        id: ID!
        name: String!
        status: TrailStatus
        difficulty: String!
        groomed: Boolean!
        trees: Boolean!
        night: Boolean!
        accessedByLifts: [Lift!]!
    }

    enum LiftStatus {
        OPEN
        HOLD
        CLOSED
    }

    enum TrailStatus {
        OPEN
        CLOSED
    }

    type Query {
        allLifts(status: LiftStatus): [Lift!]!
        Lift(id: ID!): Lift!
        liftCount(status: LiftStatus!): Int!
        allTrails(status: TrailStatus): [Trail!]!
        Trail(id: ID!): Trail!
        trailCount(status: TrailStatus!): Int!
    }

    type Mutation {
        setLiftStatus(id: ID!, status: LiftStatus!): Lift!
        setTrailStatus(id: ID!, status: TrailStatus!): Trail!
    }
`
const resolvers = {
  Query: {
    allLifts: (root, { status }, { lifts }) => {
      if (!status) {
        return lifts
      } else {
        return lifts.filter(lift => lift.status === status)
      }
    },
    Lift: (root, { id }, { lifts }) => {
      const selectedLift = lifts.filter(lift => id === lift.id)
      return selectedLift[0]
    },
    liftCount: (root, { status }, { lifts }) => {
      var i = 0
      lifts.map(lift => {
        lift.status === status ?
          i++ :
          null
      })
      return i
    },
    allTrails: (root, { status }, { trails }) => {
      if (!status) {
        return trails
      } else {
        return trails.filter(trail => trail.status === status)
      }
    },
    Trail: (root, { id }, { trails }) => {
      const selectedTrail = trails.filter(trail => id === trail.id)
      return selectedTrail[0]
    },
    trailCount: (root, { status }, { trails }) => {
      let i = 0
      trails.map(trail => {
        trail.status === status ?
          i++ :
          null
      })
      return i
    }
  },
  Mutation: {
    setLiftStatus: (root, { id, status }, { lifts, pubsub }) => {
      var updatedLift = lifts.find(lift => id === lift.id)
      updatedLift.status = status
      pubsub.publish('lift-status-change', { liftStatusChange: updatedLift })
      return updatedLift
    },
    setTrailStatus: (root, { id, status }, { trails, pubsub }) => {
      var updatedTrail = trails.find(trail => id === trail.id)
      updatedTrail.status = status
      pubsub.publish('trail-status-change', { trailStatusChange: updatedTrail })
      return updatedTrail
    }
  }
}

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  tracing: true,
  cacheControl: true
})

server.applyMiddleware({ app })
const engine = new ApolloEngine({
  apiKey: 'service:graphql-example:p8fGH6X80A7eKbKZ6pUWGQ'
})

const port = 4000

engine.listen({
  port,
  expressApp: app,
  graphqlPaths: ['/graphql']
}, () => console.log(`Listening on port ${port}!`))
