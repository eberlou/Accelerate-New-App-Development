import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NamespaceList from './components/NamespaceList';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-red-hat-dark-gray">
      <Header />
      <main className="flex-grow py-8">
        <NamespaceList />
      </main>
      <Footer />
    </div>
  );
}

export default App;