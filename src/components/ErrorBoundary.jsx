import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
          <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
            <h1 className="text-2xl font-extrabold">Artwork Proof Generator</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The app hit a startup error. Clear the saved local draft for this site, then refresh. If this keeps happening,
              the browser console will show the exact error.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-white">
              {this.state.error.message}
            </pre>
            <button
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              onClick={() => {
                localStorage.removeItem("jigsaw-artwork-proof-draft");
                window.location.reload();
              }}
            >
              Clear draft and reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
