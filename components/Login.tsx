import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'empleado@traveliz.com' && password === 'admin') {
        onLogin({
          id: '1',
          name: 'Andrea Martínez',
          email: email,
          role: 'employee',
          avatar: 'https://picsum.photos/id/64/200/200'
        });
      } else {
        // Allow any login for demo purposes if not specific credentials
        if (email && password) {
             onLogin({
                id: '2',
                name: 'Usuario Demo',
                email: email,
                role: 'employee',
                avatar: 'https://picsum.photos/id/177/200/200'
              });
        } else {
            setError('Por favor ingresa usuario y contraseña.');
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}>
      {/* Brand Authority Overlay - Traveliz Blue with opacity */}
      <div className="absolute inset-0 bg-brand/80 backdrop-blur-sm"></div>
      
      {/* Login Box - Brand Authority Theme */}
      <div className="relative z-10 w-full max-w-md p-10 bg-brand/95 backdrop-blur-md rounded-none shadow-2xl animate-fade-in-up m-4 border border-white/10">
        <div className="text-center mb-12">
          {/* Logo Container */}
          <div className="flex justify-center mb-8">
              <img 
                  src="https://traveliz.com/new-2025/wp-content/uploads/2025/07/Traveliz_Logo_white.png" 
                  alt="Traveliz Logo" 
                  className="h-12 sm:h-16 w-auto object-contain"
              />
          </div>
          <p className="text-secondary text-xs tracking-[4px] uppercase font-semibold">Intranet Corporativa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 ml-1 uppercase tracking-widest">Correo Corporativo</label>
            <div className="relative group">
              <span className="absolute left-3 top-4 text-secondary group-focus-within:text-white transition-colors">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Input bg is dark but distinct
                className="w-full pl-10 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-none text-white placeholder-secondary focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                placeholder="nombre@traveliz.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 ml-1 uppercase tracking-widest">Contraseña</label>
            <div className="relative group">
              <span className="absolute left-3 top-4 text-secondary group-focus-within:text-white transition-colors">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-none text-white placeholder-secondary focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-none bg-red-900/20 border border-red-900/30 text-red-300 text-sm flex items-center animate-shake">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          {/* Button: Traveliz Blue (Authority) with White text. Gold interaction on hover. Square corners. */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-surface text-brand hover:text-accent font-bold uppercase tracking-[2px] rounded-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-6 text-sm group"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Iniciando sesión...
              </>
            ) : (
              <>
                Entrar a Compass
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-xs text-secondary leading-relaxed">
            © 2026 Traveliz Agency. <br/>Exclusivo uso interno.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;