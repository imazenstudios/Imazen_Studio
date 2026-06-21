const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

const setupCode = `
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const res = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/landing-pages/\${slug}\`);
        setPageData(res.data);
      } catch (err) {
        console.error(err);
        navigate('/'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };
    if(slug) fetchLandingPage();
    else setLoading(false);
  }, [slug, navigate]);

  // Use pageData if available, fallback to default hardcoded arrays
  const heroImages = pageData?.heroSlides?.map(s => s.imageUrl) || [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg'
  ];
`;

content = content.replace(
  /const \[activePackages, setActivePackages\] = useState\(\[\]\);/,
  `const [activePackages, setActivePackages] = useState([]);\n${setupCode}`
);

// Add loading state right before return (
content = content.replace(
  /return \(\n    <div className="min-h-screen/,
  `  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  if (!pageData && slug) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Page Not Found</div>;

  return (
    <div className="min-h-screen`
);

// Replace the duplicate heroImages array that is down below.
content = content.replace(
  /const heroImages = \[\n    '\/images\/1\.jpg',\n    '\/images\/2\.jpg',\n    '\/images\/3\.jpg'\n  \];/g,
  ''
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Injected pageData successfully');
