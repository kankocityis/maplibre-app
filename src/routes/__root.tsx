import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100svh",
            }}
        >
            <Header />
            <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
