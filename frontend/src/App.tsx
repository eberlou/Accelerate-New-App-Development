import './App.css';
import NamespaceList from './components/NamespaceList';

function App() {
  return (
    <div className="min-h-screen bg-red-hat-gray">
      <div className="container mx-auto py-8">
        <NamespaceList />
      </div>
    </div>
  );
}

export default App;