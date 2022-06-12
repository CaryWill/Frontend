import "./styles.css";
import Form from './components/FormPro';
import { Input } from 'antd';

export default function App() {
  const schema = [
    {
      field: 'name',
      label: '测试',
      type: Input
    }
  ]
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Form schema={schema} />
    </div>
  );
}
