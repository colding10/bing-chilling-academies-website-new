export default function Footer() {
  return (
    <footer className="border-t-2 border-custom-blue/30 bg-custom-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-custom-blue font-orbitron text-xl">
            BING CHILLING ACADEMIES
          </div>
          <div className="font-play text-gray-400 text-sm">
            a group of high schoolers from the bing chilling academies who like ice cream{" "}
          </div>
          <div className="font-share-tech text-gray-500 text-xs">
            © {new Date().getFullYear()} Bing Chilling Academies. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
