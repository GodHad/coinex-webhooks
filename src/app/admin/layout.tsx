import AuthRoute from "components/AuthRoute";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthRoute>
            {children}
        </AuthRoute>
    )
} 