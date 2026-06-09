// @ts-nocheck
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, TextField, Select, MenuItem, Slider, Card, CardContent, Grid, Paper, Chip, Avatar as MuiAvatar, CircularProgress, Tooltip, IconButton
} from '@mui/material';
import { Search, SlidersHorizontal, Droplets, MapPin, Clock, Star, X, ArrowUpDown } from 'lucide-react';
import { api } from '@/lib/api';
import { TrustBadgeComp } from '@/components/common/Badge';
import { RatingDisplay } from '@/components/common/StarRating';
import { Avatar } from '@/components/common/Avatar';
import { formatCurrency } from '@/lib/utils';
import type { Supplier } from '@/types';

type SortKey = 'rating' | 'price_asc' | 'price_desc' | 'quality' | 'trust';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rating',     label: '⭐ Rating'         },
  { value: 'quality',    label: '💧 Water Quality'  },
  { value: 'trust',      label: '🛡 Trust Score'    },
  { value: 'price_asc',  label: '💰 Price: Low→High'},
  { value: 'price_desc', label: '💰 Price: High→Low'},
];

export function MarketplacePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [backendListings, setBackendListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [minQuality, setMinQuality] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.suppliers.getAll().then(data => {
      const mapped = data.map((l: any) => ({
        id: l.id,
        businessName: l.name,
        pricePerKL: l.price,
        serviceAreas: l.coverage_area || [],
        isActive: true,
        rating: l.rating,
        reviewCount: Math.floor(Math.random() * 100) + 10,
        trustBadge: l.badge,
        trustScore: l.trust_score,
        deliveryTime: l.eta,
        waterQuality: { qualityScore: 85, tds: l.tds, ph: l.ph }
      }));
      setBackendListings(mapped);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let res = backendListings.filter(s => s.isActive);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(s =>
        s.businessName.toLowerCase().includes(q) ||
        s.serviceAreas.some((a: string) => a.toLowerCase().includes(q))
      );
    }
    res = res.filter(s => s.pricePerKL <= maxPrice);
    res = res.filter(s => s.rating >= minRating);
    res = res.filter(s => s.waterQuality.qualityScore >= minQuality);
    if (selectedBadges.length > 0) {
      res = res.filter(s => selectedBadges.includes(s.trustBadge));
    }
    res.sort((a, b) => {
      if (sortBy === 'rating')     return b.rating - a.rating;
      if (sortBy === 'quality')    return b.waterQuality.qualityScore - a.waterQuality.qualityScore;
      if (sortBy === 'trust')      return b.trustScore - a.trustScore;
      if (sortBy === 'price_asc')  return a.pricePerKL - b.pricePerKL;
      if (sortBy === 'price_desc') return b.pricePerKL - a.pricePerKL;
      return 0;
    });
    return res;
  }, [search, sortBy, maxPrice, minRating, minQuality, selectedBadges]);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(c => c.filter(x => x !== id));
    } else if (compareList.length < 3) {
      setCompareList(c => [...c, id]);
    }
  };

  const compareSuppliers = backendListings.filter(s => compareList.includes(s.id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Box>
        <Typography variant="h4" fontWeight="bold">Water Supplier Marketplace</Typography>
        <Typography variant="body1" color="text.secondary">{filtered.length} suppliers available in your area</Typography>
      </Box>

      {/* Search + Sort Bar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name or area..."
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <Search size={20} color="gray" style={{ marginRight: 8 }} /> } }}
          sx={{ flex: 1, minWidth: 200, bgcolor: 'white' }}
        />
        <Select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortKey)}
          size="small"
          sx={{ bgcolor: 'white', minWidth: 150 }}
        >
          {SORT_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </Select>
        <Button 
          variant={showFilters ? "contained" : "outlined"} 
          startIcon={<SlidersHorizontal size={18} />} 
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="animate-slide-up">
          <CardContent>
            <Grid container spacing={4}>
              <Grid size={{xs: 12, sm: 4}}   >
                <Typography variant="subtitle2" gutterBottom>Max Price: {formatCurrency(maxPrice)}/KL</Typography>
                <Slider min={400} max={1500} value={maxPrice} onChange={(_, v) => setMaxPrice(v as number)} valueLabelDisplay="auto" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                  <Typography variant="caption" color="text.secondary">₹400</Typography>
                  <Typography variant="caption" color="text.secondary">₹1,500</Typography>
                </Box>
              </Grid>
              <Grid size={{xs: 12, sm: 4}}   >
                <Typography variant="subtitle2" gutterBottom>Min Rating: {minRating > 0 ? `${minRating}★` : 'Any'}</Typography>
                <Slider min={0} max={4} step={0.5} value={minRating} onChange={(_, v) => setMinRating(v as number)} valueLabelDisplay="auto" />
              </Grid>
              <Grid size={{xs: 12, sm: 4}}   >
                <Typography variant="subtitle2" gutterBottom>Min Quality: {minQuality > 0 ? `${minQuality}%` : 'Any'}</Typography>
                <Slider min={0} max={90} step={10} value={minQuality} onChange={(_, v) => setMinQuality(v as number)} valueLabelDisplay="auto" />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Trust Badge</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(['bronze','silver','gold','platinum'] as const).map(b => (
                  <Chip 
                    key={b}
                    label={`${b === 'bronze' ? '🥉' : b === 'silver' ? '🥈' : b === 'gold' ? '🥇' : '💎'} ${b.charAt(0).toUpperCase() + b.slice(1)}`}
                    onClick={() => setSelectedBadges(s => s.includes(b) ? s.filter(x => x !== b) : [...s, b])}
                    color={selectedBadges.includes(b) ? "primary" : "default"}
                    variant={selectedBadges.includes(b) ? "filled" : "outlined"}
                  />
                ))}
                {(search || maxPrice < 1500 || minRating > 0 || minQuality > 0 || selectedBadges.length > 0) && (
                  <Chip 
                    label="Clear All" 
                    onDelete={() => { setSearch(''); setMaxPrice(1500); setMinRating(0); setMinQuality(0); setSelectedBadges([]); }} 
                    color="error" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Compare Banner */}
      {compareList.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="animate-slide-up">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ArrowUpDown size={20} className="text-primary-600" />
            <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
              {compareList.length} supplier{compareList.length > 1 ? 's' : ''} selected for comparison
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {compareSuppliers.map(s => (
                <Chip key={s.id} label={s.businessName.split(' ')[0]} size="small" color="primary" />
              ))}
            </Box>
          </Box>
          {compareList.length >= 2 && (
            <Button variant="contained" size="small" onClick={() => navigate('/customer/compare', { state: { ids: compareList } })}>
              Compare Now
            </Button>
          )}
        </Paper>
      )}

      {/* Supplier Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <Search size={48} className="text-muted mx-auto mb-2 opacity-40" />
          <Typography variant="h6" fontWeight="bold">No listings found</Typography>
          <Typography variant="body2" color="text.secondary">Be the first supplier to create a listing!</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(sup => (
            <Grid size={{xs: 12, sm: 6, md: 4}}     key={sup.id}>
              <SupplierCard
                supplier={sup}
                onView={() => navigate(`/customer/supplier/${sup.id}`)}
                onBook={() => navigate('/customer/book', { state: { supplierId: sup.id } })}
                isCompared={compareList.includes(sup.id)}
                onToggleCompare={() => toggleCompare(sup.id)}
                compareDisabled={compareList.length >= 3 && !compareList.includes(sup.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function SupplierCard({ supplier: s, onView, onBook, isCompared, onToggleCompare, compareDisabled }: {
  supplier: Supplier;
  onView: () => void;
  onBook: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}) {
  const qs = s.waterQuality.qualityScore;
  const qColor = qs >= 80 ? 'success.main' : qs >= 60 ? 'warning.main' : 'error.main';
  const qBgColor = qs >= 80 ? 'success.50' : qs >= 60 ? 'warning.50' : 'error.50';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' }, border: isCompared ? '2px solid' : '1px solid', borderColor: isCompared ? 'primary.main' : 'grey.200' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar name={s.businessName} size="md" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>{s.businessName}</Typography>
            <TrustBadgeComp badge={s.trustBadge} className="text-xs mt-0.5" />
          </Box>
          <Chip 
            icon={<Droplets size={14} />} 
            label={`${qs}%`} 
            size="small" 
            sx={{ bgcolor: qBgColor, color: qColor, fontWeight: 'bold' }} 
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <RatingDisplay rating={s.rating} count={s.reviewCount} />
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {[
            { label: 'TDS', value: `${s.waterQuality.tds}`, unit: 'ppm' },
            { label: 'pH',  value: `${s.waterQuality.ph}`,  unit: ''    },
            { label: 'ETA', value: s.deliveryTime,          unit: ''    },
          ].map(stat => (
            <Grid size={{xs: 4}}   key={stat.label}>
              <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{stat.label}</Typography>
                <Typography variant="body2" fontWeight="bold">{stat.value}</Typography>
                {stat.unit && <Typography variant="caption" color="text.secondary">{stat.unit}</Typography>}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Starting from</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {formatCurrency(s.pricePerKL)}<Typography component="span" variant="caption" color="text.secondary">/KL</Typography>
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
              <MapPin size={12} />{s.serviceAreas[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
              <Clock size={12} />{s.deliveryTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button variant="outlined" size="small" fullWidth onClick={onView}>Profile</Button>
          <Button variant="contained" size="small" fullWidth onClick={onBook}>Book</Button>
        </Box>

        <Button
          variant={isCompared ? "contained" : "text"}
          color="primary"
          size="small"
          fullWidth
          disabled={compareDisabled}
          onClick={onToggleCompare}
          sx={{ bgcolor: isCompared ? 'primary.50' : 'transparent', color: isCompared ? 'primary.dark' : 'inherit', '&:hover': { bgcolor: isCompared ? 'primary.100' : 'grey.100' } }}
        >
          {isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
        </Button>
      </CardContent>
    </Card>
  );
}
