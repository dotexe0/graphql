import React  from 'react';
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const ALL_LIFTS_QUERY = gql`
  query {
      allLifts {
          id
          name
          status
      }
  }
  `

const ALL_TRAILS_QUERY = gql`
    query {
        allTrails {
            id
            name
            status
        }
    }
    `

const App = () =>
<div>
<section>
<h1> LIFTS </h1>
<Query query={ALL_LIFTS_QUERY}>
  {({ loading, data }) => {
  return <div>{!loading && data.allLifts.map(lift => <h3 key={lift.name}>{lift.name}</h3>)}</div>
}}
</Query>
</section>
<section>
<h1> Trails </h1>
<Query query={ALL_TRAILS_QUERY}>
  {({ loading, data }) => {
  return <div>{!loading && data.allTrails.map(trail => <h3 key={trail.name}>{trail.name}</h3>)}</div>
}}
</Query>
</section>
</div>

export default App
