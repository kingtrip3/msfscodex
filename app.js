const { useState, useEffect } = React;

// --- Page Components ---

function Dashboard() {
  return <h2>Dashboard</h2>;
}

function Airline() {
  return <h2>Airline</h2>;
}

const dbName = 'msfs-career';
const dbVersion = 1;
const paywareStoreName = 'payware-airports';
const fleetStoreName = 'fleet';

// --- Database Helper ---
async function openDb() {
  return idb.openDB(dbName, dbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(paywareStoreName)) {
        db.createObjectStore(paywareStoreName, { keyPath: 'icao' });
      }
      if (!db.objectStoreNames.contains(fleetStoreName)) {
        db.createObjectStore(fleetStoreName, { keyPath: 'reg' });
      }
    },
  });
}


function Payware() {
  const [airports, setAirports] = useState([]);
  const [formState, setFormState] = useState({ icao: '', city: '', country: '', continent: '' });

  // Load airports from DB on component mount
  useEffect(() => {
    async function loadAirports() {
      const db = await openDb();
      const allAirports = await db.getAll(paywareStoreName);
      setAirports(allAirports);
    }
    loadAirports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value.toUpperCase() }));
  };

  const handleAddAirport = async (e) => {
    e.preventDefault();
    if (formState.icao && formState.city && formState.country && formState.continent) {
      const db = await openDb();
      await db.put(paywareStoreName, formState);
      setAirports([...airports, formState]);
      setFormState({ icao: '', city: '', country: '', continent: '' }); // Reset form
    }
  };

  const handleDeleteAirport = async (icaoToDelete) => {
    const db = await openDb();
    await db.delete(paywareStoreName, icaoToDelete);
    setAirports(airports.filter(airport => airport.icao !== icaoToDelete));
  };

  return (
    <div>
      <h2>Payware Airports</h2>
      <form onSubmit={handleAddAirport} style={{ marginBottom: '1rem' }}>
        <input name="icao" value={formState.icao} onChange={handleInputChange} placeholder="ICAO" maxLength="4" required style={{ marginRight: '8px' }} />
        <input name="city" value={formState.city} onChange={handleInputChange} placeholder="City" required style={{ marginRight: '8px' }} />
        <input name="country" value={formState.country} onChange={handleInputChange} placeholder="Country" required style={{ marginRight: '8px' }} />
        <input name="continent" value={formState.continent} onChange={handleInputChange} placeholder="Continent" required style={{ marginRight: '8px' }} />
        <button type="submit">Add Airport</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ICAO</th>
            <th>City</th>
            <th>Country</th>
            <th>Continent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {airports.map(airport => (
            <tr key={airport.icao}>
              <td>{airport.icao}</td>
              <td>{airport.city}</td>
              <td>{airport.country}</td>
              <td>{airport.continent}</td>
              <td>
                <button onClick={() => handleDeleteAirport(airport.icao)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Fleet() {
  const [fleet, setFleet] = useState([]);
  const [formState, setFormState] = useState({ reg: '', type: '', homeBase: '', status: 'active' });

  useEffect(() => {
    async function loadFleet() {
      const db = await openDb();
      const allFleet = await db.getAll(fleetStoreName);
      setFleet(allFleet);
    }
    loadFleet();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'reg' || name === 'homeBase' ? value.toUpperCase() : value;
    setFormState(prevState => ({ ...prevState, [name]: val }));
  };

  const handleAddAircraft = async (e) => {
    e.preventDefault();
    if (formState.reg && formState.type && formState.homeBase) {
      const db = await openDb();
      await db.put(fleetStoreName, formState);
      setFleet([...fleet, formState]);
      setFormState({ reg: '', type: '', homeBase: '', status: 'active' }); // Reset form
    }
  };

  const handleDeleteAircraft = async (regToDelete) => {
    const db = await openDb();
    await db.delete(fleetStoreName, regToDelete);
    setFleet(fleet.filter(ac => ac.reg !== regToDelete));
  };

  return (
    <div>
      <h2>Fleet Manager</h2>
      <form onSubmit={handleAddAircraft} style={{ marginBottom: '1rem' }}>
        <input name="reg" value={formState.reg} onChange={handleInputChange} placeholder="Registration" required style={{ marginRight: '8px' }} />
        <input name="type" value={formState.type} onChange={handleInputChange} placeholder="Aircraft Type" required style={{ marginRight: '8px' }} />
        <input name="homeBase" value={formState.homeBase} onChange={handleInputChange} placeholder="Home Base (ICAO)" maxLength="4" required style={{ marginRight: '8px' }} />
        <select name="status" value={formState.status} onChange={handleInputChange} style={{ marginRight: '8px' }}>
            <option value="active">Active</option>
            <option value="mx">Maintenance</option>
        </select>
        <button type="submit">Add Aircraft</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Registration</th>
            <th>Type</th>
            <th>Home Base</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fleet.map(ac => (
            <tr key={ac.reg}>
              <td>{ac.reg}</td>
              <td>{ac.type}</td>
              <td>{ac.homeBase}</td>
              <td>{ac.status}</td>
              <td>
                <button onClick={() => handleDeleteAircraft(ac.reg)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Rules() {
  return <h2>Rules</h2>;
}

function Schedule() {
  return <h2>Schedule</h2>;
}


// --- Main App Structure ---

function App() {
  const [route, setRoute] = useState('dashboard');

  const navigateTo = (page) => {
    setRoute(page);
  };

  const renderPage = () => {
    switch (route) {
      case 'dashboard':
        return <Dashboard />;
      case 'airline':
        return <Airline />;
      case 'payware':
        return <Payware />;
      case 'fleet':
        return <Fleet />;
      case 'rules':
        return <Rules />;
      case 'schedule':
        return <Schedule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <React.Fragment>
      <aside>
        <h1>MSFS Career</h1>
        <nav>
          <button onClick={() => navigateTo('dashboard')} className={route === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => navigateTo('airline')} className={route === 'airline' ? 'active' : ''}>Airline</button>
          <button onClick={() => navigateTo('payware')} className={route === 'payware' ? 'active' : ''}>Payware</button>
          <button onClick={() => navigateTo('fleet')} className={route === 'fleet' ? 'active' : ''}>Fleet</button>
          <button onClick={() => navigateTo('rules')} className={route === 'rules' ? 'active' : ''}>Rules</button>
          <button onClick={() => navigateTo('schedule')} className={route === 'schedule' ? 'active' : ''}>Schedule</button>
        </nav>
      </aside>
      <main>
        {renderPage()}
      </main>
    </React.Fragment>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
