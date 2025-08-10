const { useState, useEffect } = React;

// --- Page Components ---

function Dashboard() {
  return <h2>Dashboard</h2>;
}

function Airline() {
  return <h2>Airline</h2>;
}

function Payware() {
  const [airports, setAirports] = useState([]);
  const [formState, setFormState] = useState({ icao: '', city: '', country: '', continent: '' });
  const dbName = 'msfs-career';
  const storeName = 'payware-airports';

  // Function to open the database
  async function openDb() {
    return idb.openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'icao' });
        }
      },
    });
  }

  // Load airports from DB on component mount
  useEffect(() => {
    async function loadAirports() {
      const db = await openDb();
      const allAirports = await db.getAll(storeName);
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
      await db.put(storeName, formState);
      setAirports([...airports, formState]);
      setFormState({ icao: '', city: '', country: '', continent: '' }); // Reset form
    }
  };

  const handleDeleteAirport = async (icaoToDelete) => {
    const db = await openDb();
    await db.delete(storeName, icaoToDelete);
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
  return <h2>Fleet</h2>;
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
