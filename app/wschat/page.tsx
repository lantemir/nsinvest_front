"use client";
import React, { useEffect, useState, useRef } from "react";


export default function WebSocketTest() {
  const [messages, setMessages] = useState<{ user: string; message: string; image?: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ id: number; username: string }[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4OTEyMTI0LCJpYXQiOjE3Mzg4MjU3MjQsImp0aSI6IjYyMDU2YTg4MGQ4ODQwMmRiNDBiMzlmYmE0MjQwMjhlIiwidXNlcl9pZCI6Mn0.7BFWbY5A67ZQeG4dmP9UeiyvSpy9uG5W7W9dC_sKrRU"

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/test/?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket подключен");
      // Запрос первых сообщений
      ws.send(JSON.stringify({ type: "request_messages", page: 1 }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Получены данные:", data);

      if (data.type === "chat_message") {
        console.log("Сообщение:", data.message, typeof data.message); // Проверка типа

        setMessages((prev) => [...prev, {
          user: data.username || "Аноним",
          message: data.message,
          image: data.image
        }]);
      }

      if (data.type === "chat_history") {
        //setMessages((prev) => [...data.messages.reverse(), ...prev]);
        setMessages((prev) => [...[...data.messages].reverse(), ...prev]);
        setHasMore(data.has_more);
      }

      if (data.type === "user_status") {
        console.log(`Пользователь ${data.username} теперь ${data.status}`);
      }

      if (data.type === "active_users_list") {
        setActiveUsers(data.users);
      }

    };

    ws.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket закрыт");
    };

    setSocket(ws);



    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {

    if (!socket) return;
    if (!inputMessage && !selectedImage) return;

    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => {
        socket.send(
          JSON.stringify({
            message: inputMessage,
            image: reader.result,
          })
        );
        setInputMessage("");
        setSelectedImage(null);
      };
    } else {
      socket.send(JSON.stringify({ message: inputMessage }));
      setInputMessage("");
    }

  };

  const handleScroll = () => {
    if (chatRef.current && chatRef.current.scrollTop === 0 && hasMore) {
      const newPage = page + 1;
      setPage(newPage);
      socket?.send(JSON.stringify({ type: "request_messages", page: newPage }));
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">WebSocket Чат</h2>

      <div className="mb-4 p-2 border border-gray-700 rounded-lg w-96 bg-gray-800">
        <h3 className="font-semibold">Активные пользователи:</h3>
        <ul>
          {activeUsers.map((user) => (
            <li key={user.id} className="text-green-400">{user.username}</li>
          ))}
        </ul>
      </div>

      <div
        ref={chatRef}
        className="w-96 h-80 border border-gray-700 rounded-lg overflow-y-auto p-2 bg-gray-800"
        onScroll={handleScroll}
      >
      {messages.map((msg, index) => (
  <div key={index} className="mb-2">
    <strong className="text-yellow-300">{msg.user}:</strong> {msg.message}
    {msg.image && (
      <div className="mt-2">
        <a
          href={process.env.NEXT_PUBLIC_API_URL + msg.image}
          download
          className="text-blue-500 underline"
        >
          Скачать изображение
        </a>
        {/* Если вы хотите, чтобы изображение также показывалось, но ссылка была для скачивания */}
        <a
          href={process.env.NEXT_PUBLIC_API_URL + msg.image}
          download
        >
          <img
            src={process.env.NEXT_PUBLIC_API_URL + msg.image}
            alt="Отправленное изображение"
            className="mt-2 max-w-full rounded-lg"
          />
        </a>
      </div>
    )}
  </div>
))}
      </div>

      <div className="mt-4 flex w-96">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-700 rounded-l-lg bg-gray-800 text-white"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <input
          type="file"
          className="hidden"
          id="fileInput"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
        />
        <label
          htmlFor="fileInput"
          className="p-2 bg-gray-700 cursor-pointer text-white flex items-center"
        >
          📷
        </label>
        <button className="p-2 bg-blue-600 rounded-r-lg text-white" onClick={sendMessage}>
          Отправить
        </button>
        <button className="p-2 bg-blue-600 rounded-r-lg text-white" onClick={() => console.log("messages@@@", messages)}>
          проверка messages
        </button>


      </div>
      {selectedImage && (
        <div className="mt-2">
          <p className="text-sm">Выбранное изображение:</p>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Предпросмотр"
            className="max-w-full h-20 rounded-lg border border-gray-700"
          />
        </div>
      )}
    </div>
  );
}

// //конец


// // Обновлённая версия

// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function WebSocketTest() {
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [inputMessage, setInputMessage] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [activeUsers, setActiveUsers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const chatRef = useRef(null);
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Nzc3ODI1LCJpYXQiOjE3Mzg2OTE0MjUsImp0aSI6ImJiNzYwNDkyZGM2YzRhMDE5MTM1OTJiNzcyNzQ5MzI0IiwidXNlcl9pZCI6Mn0.SjCYoACgdhqK61XmlVk6AfHrkM3zjRxYZlGKrmcBZvA";

//   useEffect(() => {
//     const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/test/?token=${token}`);

//     ws.onopen = () => {
//       console.log("WebSocket подключен");
//       ws.send(JSON.stringify({ type: "request_messages", page: 1 }));
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Получены данные:", data);

//       if (data.type === "chat_message") {
//         setMessages((prev) => [...prev, { user: data.username || "Аноним", message: data.message, image: data.image }]);
//       }

//       if (data.type === "chat_history") {
//         setMessages((prev) => [...data.messages.reverse(), ...prev]);
//         setHasMore(data.has_more);
//       }

//       if (data.type === "active_users_list") {
//         setActiveUsers(data.users);
//       }
//     };

//     ws.onerror = (error) => console.error("WebSocket ошибка:", error);
//     ws.onclose = () => console.log("WebSocket закрыт");
//     setSocket(ws);

//     return () => ws.close();
//   }, []);

//   useEffect(() => {
//     if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
//   }, [messages]);

//   const sendMessage = () => {
//     if (!socket || (!inputMessage && !selectedImage)) return;

//     if (selectedImage) {
//       const reader = new FileReader();
//       reader.readAsDataURL(selectedImage);
//       reader.onloadend = () => {
//         socket.send(JSON.stringify({ message: inputMessage, image: reader.result }));
//         setInputMessage("");
//         setSelectedImage(null);
//       };
//     } else {
//       socket.send(JSON.stringify({ message: inputMessage }));
//       setInputMessage("");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle>WebSocket Чат</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4">
//             <h3 className="font-semibold">Активные пользователи:</h3>
//             <ul className="text-green-400">
//               {activeUsers.map((user) => (
//                 <li key={user.id}>{user.username}</li>
//               ))}
//             </ul>
//           </div>
//           <ScrollArea ref={chatRef} className="h-80 border rounded-lg p-2 bg-gray-800">
//             {messages.map((msg, index) => (
//               <div key={index} className="mb-2">
//                 <strong className="text-yellow-300">{msg.user}:</strong> {msg.message}
//                 {msg.image && <img src={msg.image} alt="Отправленное изображение" className="mt-2 rounded-lg max-w-full" />}
//               </div>
//             ))}
//           </ScrollArea>
//           <div className="mt-4 flex items-center gap-2">
//             <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Введите сообщение" />
//             <input type="file" className="hidden" id="fileInput" accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
//             <label htmlFor="fileInput" className="p-2 bg-gray-700 cursor-pointer text-white">📷</label>
//             <Button onClick={sendMessage}>Отправить</Button>
//           </div>
//           {selectedImage && (
//             <div className="mt-2">
//               <p className="text-sm">Выбранное изображение:</p>
//               <img src={URL.createObjectURL(selectedImage)} alt="Предпросмотр" className="max-w-full h-20 rounded-lg border" />
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
