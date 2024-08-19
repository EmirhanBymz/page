import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const baseUrl = "http://localhost:3005";

// StatusIndicator Bileşeni
const StatusIndicator = ({ status }) => {
  const circleStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: status === 'true' ? 'green' : 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1em',
  };

  return (
    <div style={circleStyle}>
      {status === 'true' ? '100%' : '0%'}
    </div>
  );
};


function App() {
  const [intervalId, setIntervalId] = useState(null);
  const [dropdownText, setDropdownText] = useState("Veriyi Yenileme Süresi");
  const [updateMessage, setUpdateMessage] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [timeData, setTimeData] = useState(null);

  const getAllData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/Databases`);
      console.log(response.data);
      setDatabases(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    fetch('http://worldtimeapi.org/api/timezone/Europe/Istanbul')
      .then(response => response.json())
      .then(data => setTimeData(data))
      .catch(error => console.error('Hata:', error));
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setDropdownText(value === '0' ? 'Durdur' : `${value} seconds`);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setUpdateMessage("");
    }

    if (value === '0') {
      setUpdateMessage("VERİ YENİLEME DURDURULDU");
      setIsStopped(true);
    } else {
      setIsStopped(false);
      const newIntervalId = setInterval(() => {
        setUpdateMessage("VERİ GÜNCELLENDİ");
        setTimeout(() => {
          setUpdateMessage("");
        }, 1000);
        getAllData();
      }, value * 1000);
      setIntervalId(newIntervalId);
    }
  };

  if (!timeData) return <div>Yükleniyor...</div>;
  const datetime = timeData.datetime.split('T');
  const datePart = datetime[0];
  const timePart = datetime[1].split('.')[0];
  const [year, month, day] = datePart.split('-');

  return (
    <div className="container">
      <div className="datetime">
        <p>{day}/{month}/{year}<br />&nbsp;&nbsp;{timePart}</p>
      </div>
      <ul>
        <li className="menu"><a href="#">Menü</a>
          <div className="acilir-menu">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>
        </li>
      </ul>
      <br /><br /><br /><br /><br /><br /><br /><br />
      <div className="baslik">
        Veriyi Yenileme Süresi
      </div>
      <div className="dropdown">
        <select className="styled-select" onChange={handleSelectChange} value={dropdownText === 'Durdur' ? '0' : dropdownText.split(' ')[0]}>
          <option value="0">Durdur</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      {updateMessage && (
        <div className={`update-message ${isStopped ? 'stopped-message' : ''}`}>
          {updateMessage}
        </div>
      )}

      <div className="database-list">
        {databases.map((db) => (
          <div key={db.id} className="database-item">
            <span>{db.dataname}</span>
            <StatusIndicator status={db.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
