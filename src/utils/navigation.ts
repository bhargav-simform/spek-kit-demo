// Simple hash-based navigation utilities

export function useNavigate() {
  return (path: string) => {
    window.location.hash = path;
  };
}

export function useParams(): { albumId?: string } {
  const hash = window.location.hash.slice(1); // Remove #
  const match = hash.match(/^\/album\/(.+)$/);
  return {
    albumId: match ? match[1] : undefined,
  };
}

export function getCurrentPath(): string {
  return window.location.hash.slice(1) || '/';
}
