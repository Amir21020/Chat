export const Message = ({messageInfo}) => {
    const isAdmin = messageInfo.userName === "Admin"

    return (
        <div className={`w-fit ${isAdmin ? "mx-auto" : ""}`}>
            <span className={`text-sm ${isAdmin ? "text-slate-400" : "text-slate-600"}`}>
                {messageInfo.userName}
                {messageInfo.timestamp && <> &middot; {messageInfo.timestamp}</>}
            </span>
            <div className={`p-2 rounded-lg shadow-md ${isAdmin ? "bg-slate-100 italic text-sm text-center" : "bg-gray-100"}`}>
                {messageInfo.message}
            </div>
        </div>
    )
}