import Link from "next/link";

export default function HomePage() {
    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h1 className="display-6">Welcome to Event Manager</h1>
                <p className="text-body-secondary mb-0">
                    Choose a module to start.
                </p>
            </div>

            <div className="row justify-content-center g-3">
                <div className="col-12 col-md-5">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="h5">Events</h2>
                            <p className="text-body-secondary">Create and manage events.</p>
                            <Link className="btn btn-primary" href="/events">
                                Go to Events
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-5">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="h5">Places</h2>
                            <p className="text-body-secondary">Create and manage places.</p>
                            <Link className="btn btn-outline-primary" href="/places">
                                Go to Places
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}