import { Box, Typography, Card, CardContent, Grid, Paper, Chip } from '@mui/material';
import { Star } from 'lucide-react';
import { QUALITY_REPORTS } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export function CustomerWaterQualityPage() {
  const report = QUALITY_REPORTS[0] || {
    supplierName: 'Aqua Fresh Water Supplies',
    testedAt: '2026-05-20',
    tds: 142,
    ph: 7.2,
    hardness: 220,
    turbidity: 0.2,
    qualityScore: 92
  };

  const getStatus = (val: number, goodMax: number) => val <= goodMax ? 'Good' : 'Poor';
  
  // Custom logic for pH
  const getPhStatus = (ph: number) => (ph >= 6.5 && ph <= 8.5) ? 'Good' : 'Poor';

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0A2540' }}>
            AquanovaX Trust Level
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280' }}>
            Water Quality Intelligence
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Water Quality Report */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#0A2540', mb: 0.5 }}>
                Water Quality Report
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
                {report.supplierName} • {formatDate(report.testedAt)}
              </Typography>

              {/* 4 Metric Cards */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { value: report.tds, unit: 'ppm', label: 'TDS', status: getStatus(report.tds, 500) },
                  { value: report.ph, unit: 'pH', label: '', status: getPhStatus(report.ph) },
                  { value: report.hardness, unit: 'ppm', label: 'Hardness', status: getStatus(report.hardness, 300) },
                  { value: report.turbidity, unit: 'NTU', label: 'Turbidity', status: getStatus(report.turbidity, 1) },
                ].map((metric, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: metric.status === 'Good' ? '#ECFDF5' : '#FEF2F2',
                        border: `1px solid ${metric.status === 'Good' ? '#D1FAE5' : '#FEE2E2'}`,
                        borderRadius: 3,
                        p: 2,
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold" sx={{ color: metric.status === 'Good' ? '#059669' : '#DC2626', lineHeight: 1 }}>
                        {metric.value}
                      </Typography>
                      {metric.unit && (
                        <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mt: 0.5 }}>
                          {metric.unit}
                        </Typography>
                      )}
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#0A2540', mt: 1 }}>
                        {metric.label || metric.unit}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: metric.status === 'Good' ? '#059669' : '#DC2626' }}>
                        {metric.status}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Source & Location */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                    Source
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#0A2540' }}>
                    Deep Borewell
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                    Location
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#0A2540' }}>
                    Hosur Road, Bangalore
                  </Typography>
                </Grid>
              </Grid>

              {/* Overall Score Card */}
              <Box sx={{ bgcolor: report.qualityScore >= 80 ? '#ECFDF5' : '#FFFBEB', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Gauge Circle */}
                <Box sx={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={report.qualityScore >= 80 ? '#D1FAE5' : '#FEF3C7'} strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={report.qualityScore >= 80 ? '#059669' : '#D97706'} strokeWidth="12" strokeDasharray="251" strokeDashoffset={251 - (251 * report.qualityScore / 100)} strokeLinecap="round" />
                  </svg>
                  <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: report.qualityScore >= 80 ? '#059669' : '#D97706', lineHeight: 1 }}>{report.qualityScore}</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.65rem' }}>/100</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: report.qualityScore >= 80 ? '#059669' : '#D97706', mb: 0.5 }}>
                    {report.qualityScore >= 90 ? 'Excellent' : report.qualityScore >= 80 ? 'Good' : 'Average'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= Math.round(report.qualityScore / 20) ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    {report.qualityScore >= 80 ? 'Very Safe for Consumption' : 'Safe for Consumption'}
                  </Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Quality History & Parameters */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Quality History Chart */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0A2540', mb: 4 }}>
                  Quality History
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, mb: 2 }}>
                  {[
                    { date: '15 May', val: 90, active: false },
                    { date: '16 May', val: 88, active: false },
                    { date: '17 May', val: 92, active: false },
                    { date: '18 May', val: 95, active: false },
                    { date: '19 May', val: 92, active: false },
                    { date: formatDate(report.testedAt).slice(0, 6), val: report.qualityScore, active: true },
                  ].map((bar, i) => (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          bgcolor: bar.active ? '#0052CC' : '#EEF2FF', 
                          height: `${(bar.val / 100) * 100}%`,
                          borderRadius: '4px 4px 0 0',
                          minHeight: '20px'
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: '#6B7280', mt: 2, fontSize: '0.7rem' }}>
                        {bar.date}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: bar.active ? '#0052CC' : '#3B82F6', mt: 0.5 }}>
                        {bar.val}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Quality Parameters */}
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0A2540', mb: 3 }}>
                  Quality Parameters
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { label: 'TDS (ppm)', value: report.tds, pct: (report.tds / 500) * 100, status: getStatus(report.tds, 500) },
                    { label: 'pH Level', value: report.ph, pct: (report.ph / 14) * 100, status: getPhStatus(report.ph) },
                    { label: 'Hardness (ppm)', value: report.hardness, pct: (report.hardness / 300) * 100, status: getStatus(report.hardness, 300) },
                    { label: 'Turbidity (NTU)', value: report.turbidity, pct: (report.turbidity / 1) * 100, status: getStatus(report.turbidity, 1) },
                  ].map((param, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: '#0A2540', width: '120px' }}>
                        {param.label}
                      </Typography>
                      
                      <Box sx={{ flex: 1, height: 6, bgcolor: '#E5E7EB', borderRadius: 3, position: 'relative' }}>
                        <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(param.pct, 100)}%`, bgcolor: param.status === 'Good' ? '#059669' : '#DC2626', borderRadius: 3 }} />
                      </Box>
                      
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#0A2540', width: '40px', textAlign: 'right' }}>
                        {param.value}
                      </Typography>
                      
                      <Chip 
                        label={param.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: param.status === 'Good' ? '#ECFDF5' : '#FEF2F2', 
                          color: param.status === 'Good' ? '#059669' : '#DC2626', 
                          fontWeight: 'bold', 
                          height: 24, 
                          fontSize: '0.7rem',
                          border: 'none'
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
