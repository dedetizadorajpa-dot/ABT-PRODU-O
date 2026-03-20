import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram,
  Youtube,
  Music, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Coffee, 
  Utensils, 
  Mic2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  price: string;
  menu: string;
  description: string;
}

interface Table {
  id: string;
  capacity: number;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export default function App() {
  const [events, setEvents] = useState<EventData[]>([
    {
      id: '1',
      name: 'Consciência Negra',
      date: '20 de Novembro',
      time: '13:00 às 18:00',
      price: '1º Lote: R$ 120,00 (Até 31/Ago) | 2º Lote: R$ 160,00 (Até 30/Set) | 3º Lote: R$ 200,00 (Até 20/Out)',
      menu: 'Feijoada completa, petiscos (mandioca frita, ling. fina acebolada), kit agonia, copo personalizado, pulseira, música ao vivo, batida de limão.',
      description: 'Grupo Mente Solta no Clube BM Barra da Tijuca.'
    },
    {
      id: '2',
      name: 'Pagode Retro',
      date: '05 de Dezembro',
      time: '20:00',
      price: 'R$ 40,00',
      menu: 'Churrasco Misto, Cerveja Gelada',
      description: 'Relembrando os clássicos dos anos 90 e 2000.'
    }
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: '1', 
      title: 'Gastronomia', 
      description: 'Cardápio Completo: Feijoada completa, petiscos (mandioca frita, ling. fina acebolada), feijão amigo, copo personalizado, pulseira, música ao vivo, batida de limão.', 
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800' // Feijoada image
    },
    { 
      id: '2', 
      title: 'Artistas', 
      description: 'Roda de Samba (Mente Solta) e convidados especiais.', 
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', // Samba/Music image
      link: 'https://www.instagram.com/grupomentesolta_/'
    },
    { 
      id: '3', 
      title: 'Estacionamento & Traslado', 
      description: 'Van com traslado local privilegiado. Conforto e segurança. Contato: (21) 96685-5159', 
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800' // Van/Transport image
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<EventData>(events[0]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState(101);

  useEffect(() => {
    const savedCount = localStorage.getItem('visitorCount');
    const currentCount = savedCount ? parseInt(savedCount) : 101;
    const newCount = currentCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('visitorCount', newCount.toString());
  }, []);

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tables: Table[] = Array.from({ length: 33 }, (_, i) => ({
    id: `A${i + 1}`,
    capacity: 6
  }));

  const handleSendWhatsApp = () => {
    if (!selectedTable || selectedSeats.length === 0 || !name || !phone) {
      alert("Por favor, preencha todos os campos, selecione uma mesa e pelo menos uma cadeira!");
      return;
    }

    const adminNumber = "5521994215883";
    const customerNumber = phone.replace(/\D/g, '');
    const seatsText = selectedSeats.sort((a, b) => a - b).join(", ");
    
    const receiptMessage = `*RECIBO DE RESERVA - ABT PRODUÇÕES*%0A---%0AEvento: *${selectedEvent.name}*%0AData: *${selectedEvent.date}*%0AMesa: *${selectedTable.id}*%0ACadeira(s): *${seatsText}*%0ACliente: *${name}*%0AWhatsApp: *${phone}*%0A---%0A*PAGAMENTO CONFIRMADO VIA PIX*`;

    // Send to Admin
    window.open(`https://wa.me/${adminNumber}?text=${receiptMessage}`, '_blank');
    
    // Send to Customer (if they want to save it)
    setTimeout(() => {
      if (customerNumber.length >= 10) {
        window.open(`https://wa.me/55${customerNumber}?text=${receiptMessage}`, '_blank');
      }
    }, 1000);
  };

  const handleAdminLogin = () => {
    if (adminPass === '101514' || adminPass === '101425') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass('');
    } else {
      alert('Senha incorreta!');
    }
  };

  const updateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
      setSelectedEvent(editingEvent);
      setEditingEvent(null);
      alert('Evento atualizado com sucesso!');
    }
  };

  const updateFeature = (e: FormEvent) => {
    e.preventDefault();
    if (editingFeature) {
      setFeatures(features.map(f => f.id === editingFeature.id ? editingFeature : f));
      setEditingFeature(null);
      alert('Informação atualizada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-gold selection:text-black">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gold/20' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
            <Music className="text-black w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl tracking-wider text-gold">ABT PRODUÇÕES</span>
        </div>
        <a 
          href="#reserva" 
          className="bg-gold hover:bg-gold-dark text-black px-6 py-2 rounded-full font-bold transition-colors text-sm"
        >
          RESERVAR
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 bg-hero overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter">
            ABT <span className="text-gold italic">PRODUÇÕES</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase opacity-80 mb-4">
            Samba Show | Eventos
          </p>
          <motion.div 
            animate={{ 
              color: ['#ef4444', '#7f1d1d', '#ef4444'],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center gap-2 mb-12 text-xs font-bold tracking-widest uppercase"
          >
            <Users size={14} />
            <span>Visitante nº {visitorCount}</span>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#reserva" 
              className="bg-gold text-black px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-gold/20"
            >
              FAZER RESERVA
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#info" 
              className="border border-white/30 hover:border-gold/50 text-white px-10 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm"
            >
              SAIBA MAIS
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Reservation Section */}
      <section id="reserva" className="py-24 bg-zinc-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4">Reserva de Mesas</h2>
            <p className="text-white/50 tracking-widest uppercase text-sm">Escolha o evento e selecione seu lugar</p>
          </div>

          {/* Step 1: Event Selection */}
          <div className="mb-20">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">1</span>
              Selecione o Evento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedEvent(event)}
                  className={`cursor-pointer p-8 rounded-3xl border transition-all ${selectedEvent.id === event.id ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-white/10 text-white hover:border-red-600/50'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${selectedEvent.id === event.id ? 'bg-black/10' : 'bg-red-600/10'}`}>
                      <Music className={selectedEvent.id === event.id ? 'text-white' : 'text-red-600'} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${selectedEvent.id === event.id ? 'text-white/60' : 'text-red-600'}`}>{event.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <p className={`text-sm mb-4 ${selectedEvent.id === event.id ? 'text-white/70' : 'text-white/50'}`}>{event.description}</p>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <span className="flex items-center gap-1"><ChevronDown size={14} className="rotate-[-90deg]" /> {event.time}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={14} /> {event.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lots Pricing Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl text-center">
                <p className="text-gold/50 text-[10px] uppercase tracking-widest mb-2">1º Lote</p>
                <p className="text-2xl font-bold text-white">R$ 120,00</p>
                <p className="text-[10px] text-white/30 mt-2">01 a 31 de Agosto</p>
              </div>
              <div className="bg-zinc-900/50 border border-gold/30 p-6 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-gold text-black text-[8px] font-bold px-2 py-1 rounded-bl-lg">ATUAL</div>
                <p className="text-gold text-[10px] uppercase tracking-widest mb-2">2º Lote</p>
                <p className="text-2xl font-bold text-white">R$ 160,00</p>
                <p className="text-[10px] text-white/30 mt-2">01 a 30 de Setembro</p>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl text-center">
                <p className="text-gold/50 text-[10px] uppercase tracking-widest mb-2">3º Lote</p>
                <p className="text-2xl font-bold text-white">R$ 200,00</p>
                <p className="text-[10px] text-white/30 mt-2">01 a 20 de Outubro</p>
              </div>
            </div>
            
            {/* Flashing Alert Button */}
            <div className="flex justify-center mb-12">
              <motion.button
                animate={{ 
                  backgroundColor: ['rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.6)', 'rgba(212, 175, 55, 0.1)'],
                  scale: [1, 1.05, 1],
                  borderColor: ['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 1)', 'rgba(212, 175, 55, 0.3)']
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-2 px-8 py-3 rounded-full border text-gold font-bold text-xs uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <AlertCircle size={18} className="animate-pulse" />
                Atenção: Mudança de Lote em Breve!
              </motion.button>
            </div>
          </div>

          {/* Step 2: Event Details & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">2</span>
                Escolha sua Mesa e Cadeira
              </h3>
              
              {/* Event Details Card */}
              <div className="bg-zinc-900/50 border border-gold/20 rounded-3xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gold">{selectedEvent.name}</h2>
                    <div className="space-y-2 text-sm text-white/70">
                      <p className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> Local: Espaço ABT Premium</p>
                      <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-gold" /> Valor: {selectedEvent.price}</p>
                      <p className="flex items-center gap-3"><ChevronDown size={16} className="text-gold rotate-[-90deg]" /> Horário: {selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-gold uppercase tracking-widest text-[10px] font-bold mb-2">Cardápio</h4>
                    <p className="text-white/80 text-xs italic leading-relaxed">"{selectedEvent.menu}"</p>
                  </div>
                </div>
              </div>

              {/* Map Layout */}
              <div className="bg-black/40 border border-gold/20 rounded-3xl p-6 md:p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Side Bar Left */}
                  <div className="flex flex-col justify-between gap-4 w-full md:w-32">
                    <div className="bg-zinc-900 border border-gold/10 p-4 rounded-xl text-center flex flex-col items-center gap-2">
                      <Utensils className="text-gold/50 w-5 h-5" />
                      <span className="text-[10px] uppercase tracking-tighter font-bold">Cozinha</span>
                    </div>
                    <div className="bg-zinc-900 border border-gold/10 p-4 rounded-xl text-center flex flex-col items-center gap-2">
                      <Users className="text-gold/50 w-5 h-5" />
                      <span className="text-[10px] uppercase tracking-tighter font-bold">Banheiros</span>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {tables.map((table) => (
                        <div key={table.id} className="relative group">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedTable(table);
                              setSelectedSeats([]);
                            }}
                            className={`
                              w-full aspect-square rounded-lg border flex flex-col items-center justify-center transition-all
                              ${selectedTable?.id === table.id 
                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30' 
                                : 'bg-blue-dark/20 border-gold/20 hover:border-gold/50 text-gold/80 hover:text-gold'}
                            `}
                          >
                            <span className="text-xs font-bold">{table.id}</span>
                            <div className="flex items-center gap-1 mt-1 opacity-60">
                              <Users size={10} />
                              <span className="text-[8px]">{table.capacity}</span>
                            </div>
                          </motion.button>

                          {/* Seat Selection Overlay */}
                          <AnimatePresence>
                            {selectedTable?.id === table.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute top-0 left-0 w-full h-full bg-black/95 rounded-lg z-20 p-1 grid grid-cols-3 gap-1"
                              >
                                {[1, 2, 3, 4, 5, 6].map((seat) => (
                                  <button
                                    key={seat}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSeats(prev => 
                                        prev.includes(seat) 
                                          ? prev.filter(s => s !== seat) 
                                          : [...prev, seat]
                                      );
                                    }}
                                    className={`text-[8px] font-bold rounded flex items-center justify-center border ${selectedSeats.includes(seat) ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-800 text-gold/50 border-white/10'}`}
                                  >
                                    {seat}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stage Bar Right */}
                  <div className="w-full md:w-32">
                    <div className="h-full min-h-[100px] bg-gold rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-black shadow-lg shadow-gold/20">
                      <Mic2 className="w-8 h-8" />
                      <span className="font-serif font-black text-xl tracking-tighter uppercase [writing-mode:vertical-rl] md:[writing-mode:horizontal-tb]">Palco</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border border-gold/20 bg-blue-dark/20"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">Livre</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-red-600 shadow-lg shadow-red-600/20"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">Reservado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-zinc-800 border border-white/5"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">Completo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Checkout Form */}
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">3</span>
                Finalizar Reserva
              </h3>
              
              <div className="bg-white rounded-3xl p-8 text-black shadow-2xl sticky top-24">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-whatsapp" />
                  Pagamento via PIX
                </h3>
                
                <div className="mb-8 p-4 bg-zinc-100 rounded-2xl border border-zinc-200">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Resumo da Reserva</p>
                  <p className={`text-lg font-bold ${selectedTable ? 'text-red-600' : 'text-zinc-400'}`}>
                    {selectedTable 
                      ? `Mesa ${selectedTable.id} ${selectedSeats.length > 0 ? `- Cadeira(s) ${selectedSeats.sort((a, b) => a - b).join(", ")}` : '(Escolha a(s) Cadeira(s))'}` 
                      : 'Nenhuma mesa selecionada'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">{selectedEvent.name} - {selectedEvent.date}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Nome Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="Ex: 21 99421-5883"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-200 mt-6">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-3 text-center">Passo 1: Realize o Pagamento</p>
                    <a 
                      href="https://nubank.com.br/cobrar/6dwsby/69bdc23f-75e0-495d-9584-e75dc4f19d6e"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 transition-all mb-4"
                    >
                      <CheckCircle2 size={20} />
                      PAGAR VIA PIX
                    </a>

                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-3 text-center">Passo 2: Confirme e Receba o Recibo</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendWhatsApp}
                      className="w-full bg-whatsapp hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-whatsapp/20 transition-all"
                    >
                      <Phone size={20} />
                      CONFIRMAR E ENVIAR RECIBO
                    </motion.button>
                  </div>
                </div>

                <p className="text-[10px] text-center text-zinc-400 mt-6 leading-relaxed">
                  Após o pagamento, clique em "CONFIRMAR E ENVIAR RECIBO" para notificar a ABT Produções e receber seu comprovante no WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center space-y-4">
              <div className="w-full aspect-[4/3] mx-auto bg-zinc-900 rounded-2xl overflow-hidden border border-gold/30 relative group">
                {feature.imageUrl ? (
                  <img 
                    src={feature.imageUrl} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="text-gold w-8 h-8 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-end p-6">
                  <h3 className="text-lg font-bold text-gold uppercase tracking-tighter mb-2">{feature.title}</h3>
                  {feature.link ? (
                    <a 
                      href={feature.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gold text-black text-[10px] font-bold px-4 py-2 rounded-full hover:bg-white transition-colors mb-2"
                    >
                      VER NO INSTAGRAM
                    </a>
                  ) : (
                    <a 
                      href="#reserva" 
                      className="bg-gold/20 text-gold border border-gold/50 text-[10px] font-bold px-4 py-2 rounded-full hover:bg-gold hover:text-black transition-all mb-2"
                    >
                      RESERVAR AGORA
                    </a>
                  )}
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed px-4">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Partners Section */}
      <section id="partners" className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold mb-12 tracking-tighter uppercase">Nossos Parceiros</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.instagram.com/jpadedetizadora/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-zinc-900 border border-gold/20 p-6 rounded-2xl hover:border-gold transition-all duration-300 w-full sm:w-64"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Instagram className="text-gold w-6 h-6" />
                </div>
                <span className="font-bold text-white group-hover:text-gold transition-colors">@jpadedetizadora</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Dedetização & Limpeza</span>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/kitcgurrascoagonia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-zinc-900 border border-gold/20 p-6 rounded-2xl hover:border-gold transition-all duration-300 w-full sm:w-64"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Utensils className="text-gold w-6 h-6" />
                </div>
                <span className="font-bold text-white group-hover:text-gold transition-colors">@kitagonia</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Kits de Churrasco</span>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/studiovouga/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-zinc-900 border border-gold/20 p-6 rounded-2xl hover:border-gold transition-all duration-300 w-full sm:w-64"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Instagram className="text-gold w-6 h-6" />
                </div>
                <span className="font-bold text-white group-hover:text-gold transition-colors">@studiovouga</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Fotografia & Design</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="bg-zinc-900 border border-gold/20 p-8 rounded-3xl max-w-sm w-full">
              <h3 className="text-2xl font-bold text-gold mb-6 text-center">Área Administrativa</h3>
              <input 
                type="password" 
                placeholder="Senha de Acesso"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 mb-4 focus:border-gold outline-none transition-all"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 border border-white/10 py-3 rounded-xl font-bold hover:bg-white/5"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gold text-black py-3 rounded-xl font-bold hover:bg-gold-dark"
                >
                  ENTRAR
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-[100] bg-black overflow-y-auto p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-gold">Painel de Controle</h2>
                <button 
                  onClick={() => setIsAdmin(false)}
                  className="bg-zinc-800 text-white px-6 py-2 rounded-full font-bold"
                >
                  SAIR DO PAINEL
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Event Management */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white border-b border-gold/20 pb-2">Gestão de Eventos</h3>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{event.name}</p>
                          <p className="text-xs text-white/50">{event.date} às {event.time}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingEvent(event);
                            setEditingFeature(null);
                          }}
                          className="text-gold font-bold text-sm underline"
                        >
                          EDITAR
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Edit Event Form */}
                  {editingEvent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 p-8 rounded-3xl border border-gold/20">
                      <h3 className="text-xl font-bold mb-6">Editar Evento</h3>
                      <form onSubmit={updateEvent} className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Nome do Evento"
                          value={editingEvent.name}
                          onChange={e => setEditingEvent({...editingEvent, name: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Data"
                            value={editingEvent.date}
                            onChange={e => setEditingEvent({...editingEvent, date: e.target.value})}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                          />
                          <input 
                            type="text" 
                            placeholder="Hora"
                            value={editingEvent.time}
                            onChange={e => setEditingEvent({...editingEvent, time: e.target.value})}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Preço"
                          value={editingEvent.price}
                          onChange={e => setEditingEvent({...editingEvent, price: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                        />
                        <textarea 
                          placeholder="Cardápio"
                          value={editingEvent.menu}
                          onChange={e => setEditingEvent({...editingEvent, menu: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 h-24"
                        />
                        <textarea 
                          placeholder="Descrição"
                          value={editingEvent.description}
                          onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 h-24"
                        />
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 border border-white/10 py-3 rounded-xl font-bold">CANCELAR</button>
                          <button type="submit" className="flex-1 bg-gold text-black py-3 rounded-xl font-bold">SALVAR</button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>

                {/* Feature Management */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white border-b border-gold/20 pb-2">Gestão de Destaques</h3>
                  <div className="space-y-4">
                    {features.map(feature => (
                      <div key={feature.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{feature.title}</p>
                          <p className="text-[10px] text-white/50 truncate max-w-[200px]">{feature.description}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingFeature(feature);
                            setEditingEvent(null);
                          }}
                          className="text-gold font-bold text-sm underline"
                        >
                          EDITAR
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Edit Feature Form */}
                  {editingFeature && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 p-8 rounded-3xl border border-gold/20">
                      <h3 className="text-xl font-bold mb-6">Editar Destaque</h3>
                      <form onSubmit={updateFeature} className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Título"
                          value={editingFeature.title}
                          onChange={e => setEditingFeature({...editingFeature, title: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                        />
                        <input 
                          type="text" 
                          placeholder="URL da Foto"
                          value={editingFeature.imageUrl || ''}
                          onChange={e => setEditingFeature({...editingFeature, imageUrl: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                        />
                        <input 
                          type="text" 
                          placeholder="Link (Opcional)"
                          value={editingFeature.link || ''}
                          onChange={e => setEditingFeature({...editingFeature, link: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                        />
                        <textarea 
                          placeholder="Descrição"
                          value={editingFeature.description}
                          onChange={e => setEditingFeature({...editingFeature, description: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 h-32"
                        />
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditingFeature(null)} className="flex-1 border border-white/10 py-3 rounded-xl font-bold">CANCELAR</button>
                          <button type="submit" className="flex-1 bg-gold text-black py-3 rounded-xl font-bold">SALVAR</button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <Music className="text-black w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg tracking-wider text-gold">ABT PRODUÇÕES</span>
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://instagram.com/abtproducoes" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">
            <Instagram size={24} />
          </a>
          <a href="https://youtube.com/@abtproducoes" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">
            <Youtube size={24} />
          </a>
          <a href="https://wa.me/5521966855159" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">
            <Phone size={24} />
          </a>
        </div>
        <p className="text-white/30 text-sm">© 2026 ABT Produções. Todos os direitos reservados.</p>
        <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest">Samba Show | Eventos</p>
        
        <button 
          onClick={() => setShowAdminLogin(true)}
          className="mt-8 text-[10px] text-white/10 hover:text-gold transition-colors uppercase tracking-[0.2em]"
        >
          Acesso Administrativo
        </button>
      </footer>
    </div>
  );
}
