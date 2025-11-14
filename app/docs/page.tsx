import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 font-digital">Mammoth Documentation</h1>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Learn how to use Mammoth for decentralized storage in the BlockDAG ecosystem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Learn the basics of Mammoth and how to set up your first project.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">Introduction to Mammoth</a>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">Creating an Account</a>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">Uploading Your First File</a>
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">API Reference</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Comprehensive documentation for the Mammoth API.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">Authentication</a>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">File Operations</a>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                  <a href="#" className="text-accent hover:underline">IPFS Pinning</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="card mb-12">
            <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Learn how to integrate Mammoth into your applications with these code examples.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">JavaScript</h3>
              <pre className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
                <code>{`// Install the Mammoth SDK
// npm install @mammoth/sdk

import { MammothClient } from '@mammoth/sdk';

// Initialize the client
const mammoth = new MammothClient({
  apiKey: 'YOUR_API_KEY',
});

// Upload a file
async function uploadFile() {
  const result = await mammoth.upload({
    file: myFile,
    pinToIPFS: true,
  });
  
  console.log(\`File uploaded! CID: \${result.cid}\`);
  console.log(\`IPFS URL: ipfs://\${result.cid}\`);
  console.log(\`Gateway URL: \${result.url}\`);
}`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Python</h3>
              <pre className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
                <code>{`# Install the Mammoth SDK
# pip install mammoth-sdk

from mammoth import MammothClient

# Initialize the client
mammoth = MammothClient(api_key='YOUR_API_KEY')

# Upload a file
def upload_file(file_path):
    result = mammoth.upload(
        file_path=file_path,
        pin_to_ipfs=True
    )
    
    print(f"File uploaded! CID: {result.cid}")
    print(f"IPFS URL: ipfs://{result.cid}")
    print(f"Gateway URL: {result.url}")`}</code>
              </pre>
            </div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
            <h2 className="text-2xl font-bold mb-4 text-accent">Need Help?</h2>
            <p className="mb-4">
              Our support team is ready to assist you with any questions or issues you may have.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="btn btn-primary">Contact Support</a>
              <a href="#" className="btn btn-secondary">Join Discord</a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
