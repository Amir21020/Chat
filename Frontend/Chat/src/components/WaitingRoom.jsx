import { Heading, Text, Input, Button } from "@chakra-ui/react"
import { useState } from "react"

export const WaitingRoom = ({ joinChat, error }) => {
    const [userName, setUserName] = useState("")
    const [chatRoom, setChatRoom] = useState("")
    const [validationError, setValidationError] = useState("")

    const onSubmit = (e) => {
        e.preventDefault()
        setValidationError("")

        if (!userName.trim()) {
            setValidationError("Введите имя пользователя")
            return
        }
        if (!chatRoom.trim()) {
            setValidationError("Введите название чата")
            return
        }

        joinChat(userName.trim(), chatRoom.trim())
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm w-full bg-white p-8 rounded shadow-lg">
            <Heading>Онлайн чат</Heading>
            <div className="mb-4">
                <Text fontSize={"sm"}>Имя пользователя</Text>
                <Input onChange={(e) => setUserName(e.target.value)} name="userName" placeholder="Введите ваше имя"></Input>
            </div>
            <div className="mb-4">
                <Text fontSize={"sm"}>Название чата</Text>
                <Input onChange={(e) => setChatRoom(e.target.value) } name="chatRoom" placeholder="Введите название чата" />
            </div>
            {(validationError || error) && (
                <div className="mb-4 text-red-500 text-sm">{validationError || error}</div>
            )}
            <div className="flex justify-center">
                <Button type="submit" colorScheme="blue">
                    Присоединиться
                </Button>
            </div>
        </form>
    )
}