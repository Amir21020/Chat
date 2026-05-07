import { Button, CloseButton, Heading, Input } from "@chakra-ui/react";
import { Message } from "./Message";
import { useEffect, useRef, useState } from "react";

export const Chat = ({ messages, chatRoom, users, connectionStatus, closeChat, sendMessage }) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const onSendMessage = () => {
        if (!message.trim()) return;
        sendMessage(message.trim());
        setMessage("");
        inputRef.current?.focus();
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") onSendMessage();
    };

    return (
        <div className="w-1/2 bg-white p-8 rounded shadow-lg">
            <div className="flex flex-row justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <Heading size="lg">{chatRoom}</Heading>
                </div>
                <CloseButton onClick={closeChat} />
            </div>
            {users.length > 0 && (
                <div className="mb-3 text-sm text-slate-500">
                    В чате: {users.join(", ")}
                </div>
            )}
            <div className="flex flex-col overflow-auto scroll-smooth h-96 gap-3 pb-3">
                {messages.map((messageInfo, index) => (
                    <Message messageInfo={messageInfo} key={index} />
                ))}
                <span ref={messagesEndRef} />
            </div>
            <div className="flex gap-3">
                <Input ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={onKeyDown} placeholder="Введите сообщение" />
                <Button colorScheme="blue" onClick={onSendMessage}>Отправить</Button>
            </div>
        </div>
    );
};
