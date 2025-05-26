import VaccineScheduler from './components/VaccineScheduler';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <VaccineScheduler />
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 儿童疫苗接种排期助手 | 基于国家免疫规划疫苗儿童免疫程序及说明（2021年版）</p>
      </footer>
    </div>
  );
}

export default App;
