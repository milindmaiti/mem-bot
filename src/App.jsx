import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([])
  return (
    <div className="grid-container">
      <div>
        <RemoveDocuments documents={documents} setDocuments={setDocuments} />
      </div>
      <div>
        <DisplayMessages messages={messages} setMessages={setMessages} />
      </div>
      <div>
        <NewChat documents={documents} setDocuments={setDocuments} setMessages={setMessages} />
        <AddDoc documents={documents} setDocuments={setDocuments} />
      </div>
      <div>
        <SearchDocument />
        <UserProfile />
      </div>
    </div>
  )
}

function DisplayMessages({ messages, setMessages }) {
  const [query, setQuery] = useState("");

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  async function handleDown(e) {
    if (e.key == 'Enter') {
      var tmp = query;
      setQuery("");
      setMessages(messages => [...messages, { "user": tmp }]);
      var response = await axios.post('http://127.0.0.1:5000/chat', {
        "query": tmp
      })
      setMessages(messages => [...messages, { "assistant": response.data }]);
    }
  }
  return (
    <>
      <div className='h-[83vh]'>
        <div className='scrollable chat'>
          {
            messages.map((msg, idx) => {
              if (Object.keys(msg)[0] == "user") {
                return (
                  <div className="self-end mb-4 max-w-xs">
                    <div className="bg-blue-500 text-white p-4 rounded-lg rounded-br-none relative">
                      <p>{Object.values(msg)[0]}</p>
                      <div className="absolute -bottom-2 right-2 w-0 h-0 border-r-8 border-r-transparent border-t-8 border-t-blue-500 border-l-8 border-l-transparent"></div>
                    </div>
                  </div>

                );
              }
              else {
                return (
                  < div className="self-start mb-4 max-w-xs">
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg rounded-bl-none shadow relative">
                      <p>{Object.values(msg)[0]}</p>
                      <div className="absolute -bottom-2 left-2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-gray border-r-8 border-r-transparent"></div>
                    </div>
                  </div>

                );
              }
            })

          }
        </div>
      </div >
      <input className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-12" type="text" value={query} onChange={handleQueryChange} onKeyDown={handleDown} placeholder="Enter Chat Message"></input>
    </>

  )
}
function NewChat({ documents, setDocuments, setMessages }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(title);

    const response = await axios.post('http://127.0.0.1:5000/new_conversation');
    setDocuments([...documents, { [title]: response.data }]);
    setMessages([]);
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <label className="block" htmlFor="title">Chat Title:</label>
      <input className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={title} onChange={handleTitleChange}></input>
      <button type="submit" className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 mb-2 rounded">New Chat</button>
    </form>
  );
}

function AddDoc({ documents, setDocuments }) {
  const [text, setText] = useState("");
  const [docTitle, setDocTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    var tmp = text;
    setText("");
    setDocTitle("");
    const response = await axios.post('http://127.0.0.1:5000/add_document', {
      "document": tmp
    });
    setDocuments(documents => [...documents, { [docTitle]: response.data }]);
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleTitleChange(e) {
    setDocTitle(e.target.value);
  }
  return (
    <form onSubmit={handleSubmit}>

      <label className="block">Document Title:</label>
      <input type="text" className="mb-3 block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder='Enter Document Title' value={docTitle} onChange={handleTitleChange}></input>

      <textarea id="message" value={text} onChange={handleTextChange} rows="20" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[58vh]" placeholder="Write your document here..."></textarea>

      <button type="submit" className="button mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Document</button>
    </form>
  );
}

function SearchDocument() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    var tmp = query;
    setQuery("");

    const response = await axios.post("http://127.0.0.1:5000/search", {
      "query": tmp
    });

    setSearch(response.data[0]);
  }

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='scrollable'>
        {search}
      </div>
      <input type="text" className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder='Enter Search Query' value={query} onChange={handleQueryChange}></input>
      <button className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2" type="submit" >Search</button>
    </form>
  );

}

function UserProfile() {
  const [profile, setProfile] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post('http://127.0.0.1:5000/get_profile');
    setProfile(response.data);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='scrollable'>
        {profile}
      </div>
      <button className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" >User Profile</button>
    </form>
  );

}

function RemoveDocuments({ documents, setDocuments }) {
  async function handleSubmit(e) {
    e.preventDefault();
    var foundTitle = e.nativeEvent.submitter.innerText;
    console.log(e.nativeEvent.submitter.innerText);
    var ix = 0;
    for (var i = 0; i < documents.length; i++) {
      if (foundTitle == Object.keys(documents[i])[0]) {
        ix = i;
        break;
      }
    }
    const newDocuments = documents.filter((item, i) => i !== ix);
    setDocuments(newDocuments);

    var id = Object.values(documents[ix])[0];
    const response = await axios.post('http://127.0.0.1:5000/delete_document', {
      "id": id
    });
  }
  return (
    <>
      <h1 className="mt-2 mb-10 font-bold text-5xl">MemBot</h1>
      <form onSubmit={handleSubmit}>
        <h1>Your Documents</h1>
        {documents.map((doc, index) => {
          return (<button className="button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2" type="submit" key={index}>{Object.keys(doc)[0]}</button>);
        })}
      </form>
    </>
  )
}
export default App
