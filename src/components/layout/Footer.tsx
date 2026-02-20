export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
      <p>© {new Date().getFullYear()} ElectroHub. Todos los derechos reservados</p>
    </footer>
  );
}
