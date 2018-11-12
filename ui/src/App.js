import React  from 'react';
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import './App.css'

const ALL_LIFTS_QUERY = gql`
  query {
    allLifts {
      name
      status
    }
}
`

const ALL_TRAILS_QUERY = gql`
  query {
    allTrails {
      name
      status
    }
}
`

const App = () =>
  <div>
  <table>
    <thead>
     <tr>
       <th> LIFTS </th>
     </tr>
    </thead>
    <tbody>
      <Query query={ALL_LIFTS_QUERY}>
        {({ loading, data }) => !loading && data.allLifts.map(lift => 
        <tr key={lift.name}>
          <td key={lift.name}>{lift.name}: {lift.status}</td>
        </tr>)}
      </Query>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th> TRAILS </th>
      </tr>
      </thead>
    <tbody>
      <Query key="trails" query={ALL_TRAILS_QUERY}>
        {({ loading, data }) => !loading && data.allTrails.map(trail => 
        <tr key={trail.name}>
          <td key={trail.name}>{trail.name}: {trail.status}</td>
        </tr>)}
      </Query>
    </tbody>
  </table>
  </div>

export default App
