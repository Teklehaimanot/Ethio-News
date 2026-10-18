import DeleteAccount from "./DeleteAccount";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <DeleteAccount />
      </main>
      <Footer />
    </div>
  );
}

export default App;
