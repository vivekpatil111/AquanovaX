// Supplier Profile Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { TrustBadgeComp, RiskBadge } from '@/components/common/Badge';
import { RatingDisplay, StarRating } from '@/components/common/StarRating';
import { Avatar } from '@/components/common/Avatar';
import { MockMap } from '@/components/maps/MockMap';
import { formatCurrency, formatDate, getTDSLabel, getPHLabel, getQualityLabel } from '@/lib/utils';
import { MapPin, Clock, Droplets, Phone, Mail, Award, CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SupplierProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.suppliers.getOne(id),
        api.reviews.getBySupplier(id)
      ]).then(([supData, revData]) => {
        setSupplier(supData);
        setReviews(revData || []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!supplier) return <div className="p-8 text-center">Supplier not found</div>;

  const mapPoint = [{
    id: supplier.id, lat: 19.07, lng: 72.87,
    type: 'supplier' as const, label: 'Depot', isAnimated: true,
  }];

  const wq = { qualityScore: 85, tds: supplier.tds || 50, ph: supplier.ph || 7.2, hardness: 120, lastTested: supplier.created_at };
  const tdsInfo     = getTDSLabel(wq.tds);
  const phInfo      = getPHLabel(wq.ph);
  const qualityInfo = getQualityLabel(wq.qualityScore);

  const verificationItems = [
    { label: 'Aadhaar',  status: 'verified' },
    { label: 'GST',      status: 'verified' },
    { label: 'Business', status: 'verified' },
    { label: 'FSSAI',    status: 'verified' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-5 -left-5 w-28 h-28 rounded-full bg-white" />
        </div>
        <div className="relative flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            💧
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{supplier.name}</h1>
              <TrustBadgeComp badge={supplier.badge} className="bg-white/20 text-white border-white/30" />
            </div>
            <p className="text-primary-200 mt-1">Quality water supplied in your area.</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-primary-100">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{supplier.coverage_area?.[0] || 'Local'}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" />+91 9876543210</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{supplier.eta || '2 hours'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(supplier.price)}</div>
            <div className="text-primary-200 text-sm">per kiloliter</div>
            <button onClick={() => navigate('/customer/book', { state: { supplierId: supplier.id } })}
              className="mt-3 bg-white text-primary-700 font-semibold px-5 py-2 rounded-lg hover:bg-primary-50 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Trust Score */}
          <div className="card text-center">
            <div className="text-4xl font-bold gradient-text mb-1">{supplier.trust_score}</div>
            <div className="text-sm text-muted mb-3">Trust Score</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div className="h-2 rounded-full gradient-primary-bg transition-all"
                style={{ width: `${supplier.trust_score}%` }} />
            </div>
            <TrustBadgeComp badge={supplier.badge} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="font-bold text-dark">{Number(1250).toLocaleString()}</div>
                <div className="text-muted text-xs">Total Orders</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="font-bold text-dark">{reviews.length}</div>
                <div className="text-muted text-xs">Reviews</div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="card">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />Verification Status
            </h3>
            <div className="space-y-2">
              {verificationItems.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  {item.status === 'verified' ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : item.status === 'rejected' ? (
                    <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="card">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />Coverage Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {(supplier.coverage_area || []).map((area: string) => (
                <span key={area} className="badge badge-primary">{area}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Water Quality */}
          <div className="card">
            <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary-500" />Water Quality Report
              <span className="ml-auto text-xs text-muted">Tested: {formatDate(wq.lastTested)}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Quality Score', value: `${wq.qualityScore}%`,  info: qualityInfo, sublabel: 'Overall' },
                { label: 'TDS',           value: `${wq.tds} ppm`,        info: tdsInfo,     sublabel: 'Total Dissolved Solids' },
                { label: 'pH Level',      value: wq.ph.toFixed(1),       info: phInfo,      sublabel: '(6.5–8.5 ideal)' },
                { label: 'Hardness',      value: `${wq.hardness} mg/L`,  info: { label: wq.hardness < 150 ? 'Soft' : 'Hard', color: wq.hardness < 150 ? 'text-emerald-600' : 'text-amber-600' }, sublabel: 'Mineral Content' },
              ].map(metric => (
                <div key={metric.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-dark">{metric.value}</div>
                  <div className={cn('text-sm font-semibold mt-0.5', metric.info.color)}>{metric.info.label}</div>
                  <div className="text-xs text-muted mt-0.5">{metric.sublabel}</div>
                </div>
              ))}
            </div>
            {/* Quality bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Quality Score</span><span>{wq.qualityScore}/100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full transition-all', wq.qualityScore >= 80 ? 'bg-emerald-500' : wq.qualityScore >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${wq.qualityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-dark">Depot Location</h3>
            </div>
            <MockMap points={mapPoint} height="200px" />
          </div>

          {/* Rating Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark">Customer Reviews</h3>
              <RatingDisplay rating={supplier.rating} count={reviews.length} size="md" />
            </div>

            {/* Rating bars */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                {[5,4,3,2,1].map(star => {
                  const pct = star === 5 ? 55 : star === 4 ? 25 : star === 3 ? 12 : star === 2 ? 5 : 3;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{star}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-muted w-7">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold gradient-text">{supplier.rating}</div>
                <StarRating value={supplier.rating} size="md" className="mt-2" />
                <div className="text-xs text-muted mt-1">{reviews.length} reviews</div>
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={r.customers?.full_name || 'Customer'} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-dark">{r.customers?.full_name || 'Customer'}</p>
                      <div className="flex items-center gap-2">
                        <StarRating value={r.rating} size="sm" />
                        <span className="text-xs text-muted">{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{r.review_text || r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
