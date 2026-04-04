import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { fmtFull$, fmtDate } from '@/lib/utils'

const styles = StyleSheet.create({
  page:       { fontFamily:'Helvetica', backgroundColor:'#0B0E1A', color:'#EEF0F5', padding:48 },
  header:     { marginBottom:28, paddingBottom:16, borderBottomWidth:2, borderBottomColor:'#F26419', borderBottomStyle:'solid' },
  logo:       { fontSize:24, fontWeight:'bold', color:'#FFFFFF' },
  logoAccent: { color:'#F26419' },
  tagline:    { fontSize:8, color:'#6B7794', marginTop:4 },
  row:        { flexDirection:'row', justifyContent:'space-between' },
  contact:    { fontSize:8.5, color:'#6B7794', textAlign:'right' },
  title:      { fontSize:22, fontWeight:'bold', color:'#FFFFFF', marginBottom:4 },
  subtitle:   { fontSize:9.5, color:'#9AA0B8', marginBottom:16 },
  divider:    { borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)', borderBottomStyle:'solid', marginVertical:14 },
  sectionLbl: { fontSize:9, fontWeight:'bold', color:'#F26419', letterSpacing:1.2, marginBottom:8, marginTop:18 },
  body:       { fontSize:9, color:'#9AA0B8', lineHeight:1.7, marginBottom:8 },
  infoBox:    { backgroundColor:'#141929', padding:14, marginTop:6, borderLeftWidth:3, borderLeftColor:'#F26419', borderLeftStyle:'solid' },
  priceHead:  { flexDirection:'row', marginBottom:8 },
  priceHdr:   { fontSize:8, color:'#6B7794' },
  priceRow:   { flexDirection:'row', paddingVertical:6, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)', borderBottomStyle:'solid' },
  priceLbl:   { fontSize:9, color:'#EEF0F5', flex:3 },
  priceType:  { fontSize:8, color:'#6B7794', flex:1, textAlign:'center' },
  priceAmt:   { fontSize:9, color:'#F26419', fontWeight:'bold', flex:1, textAlign:'right' },
  totalRow:   { flexDirection:'row', justifyContent:'space-between', paddingTop:10, marginTop:4 },
  totalLbl:   { fontSize:11, fontWeight:'bold', color:'#FFFFFF' },
  totalVal:   { fontSize:13, fontWeight:'bold', color:'#22C55E' },
  chip:       { backgroundColor:'rgba(242,100,25,0.15)', paddingVertical:3, paddingHorizontal:8, marginRight:6 },
  chipText:   { fontSize:7.5, color:'#F26419', fontWeight:'bold' },
  chips:      { flexDirection:'row', flexWrap:'wrap', marginBottom:18 },
  footer:     { position:'absolute', bottom:32, left:48, right:48, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.07)', borderTopStyle:'solid', paddingTop:8, flexDirection:'row', justifyContent:'space-between' },
  footerTxt:  { fontSize:7.5, color:'#6B7794' },
  metaRow:    { flexDirection:'row', paddingVertical:6, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)', borderBottomStyle:'solid' },
  metaLbl:    { fontSize:8, color:'#6B7794', width:90 },
  metaVal:    { fontSize:8.5, color:'#EEF0F5', flex:1 },
})

interface Props { proposal: any }

export function ProposalPDFDocument({ proposal }: Props) {
  const pricing: any[] = proposal.pricing_breakdown ?? []
  const total = pricing.reduce((s: number, p: any) => s + (p.amount ?? 0), 0)
  const recipient = proposal.clients?.company_name
    ?? (proposal.leads ? `${proposal.leads.first_name} ${proposal.leads.last_name}` : 'Valued Client')

  return (
    <Document title={proposal.title}>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.row}>
            <View>
              <Text style={styles.logo}>
                {'KROMIUM'}
                <Text style={styles.logoAccent}>{'.'}</Text>
              </Text>
              <Text style={styles.tagline}>DIGITAL TRANSFORMATION PARTNER</Text>
            </View>
            <View>
              <Text style={styles.contact}>hello@kromiumdigital.com</Text>
              <Text style={styles.contact}>(246) 232-1006</Text>
              <Text style={styles.contact}>kromiumdigital.com</Text>
              <Text style={styles.contact}>Barbados, Caribbean</Text>
            </View>
          </View>
        </View>

        {/* Title block */}
        <Text style={styles.title}>{proposal.title}</Text>
        <Text style={styles.subtitle}>
          {`Prepared for ${recipient}  ·  ${fmtDate(proposal.created_at)}`}
          {proposal.valid_until ? `  ·  Valid until ${fmtDate(proposal.valid_until)}` : ''}
        </Text>

        {/* Service chips */}
        {(proposal.services ?? []).length > 0 && (
          <View style={styles.chips}>
            {(proposal.services as string[]).map((s: string) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Scope */}
        {proposal.scope ? (
          <View>
            <Text style={styles.sectionLbl}>SCOPE OF WORK</Text>
            <Text style={styles.body}>{proposal.scope}</Text>
          </View>
        ) : null}

        {/* Deliverables */}
        {proposal.deliverables ? (
          <View>
            <Text style={styles.sectionLbl}>DELIVERABLES</Text>
            <Text style={styles.body}>{proposal.deliverables}</Text>
          </View>
        ) : null}

        {/* Timeline */}
        {proposal.timeline ? (
          <View>
            <Text style={styles.sectionLbl}>TIMELINE</Text>
            <Text style={styles.body}>{proposal.timeline}</Text>
          </View>
        ) : null}

        {/* Pricing */}
        {pricing.length > 0 ? (
          <View>
            <Text style={styles.sectionLbl}>INVESTMENT</Text>
            <View style={styles.infoBox}>
              <View style={styles.priceHead}>
                <Text style={[styles.priceHdr, { flex:3 }]}>Description</Text>
                <Text style={[styles.priceHdr, { flex:1, textAlign:'center' }]}>Type</Text>
                <Text style={[styles.priceHdr, { flex:1, textAlign:'right' }]}>Amount</Text>
              </View>
              {pricing.map((item: any, i: number) => (
                <View key={i} style={styles.priceRow}>
                  <Text style={styles.priceLbl}>{item.description}</Text>
                  <Text style={styles.priceType}>{(item.type ?? '').replace(/_/g, ' ')}</Text>
                  <Text style={styles.priceAmt}>{fmtFull$(item.amount ?? 0)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLbl}>Total Investment</Text>
                <Text style={styles.totalVal}>{fmtFull$(total)}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Terms */}
        {proposal.terms ? (
          <View>
            <Text style={styles.sectionLbl}>TERMS AND CONDITIONS</Text>
            <Text style={styles.body}>{proposal.terms}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerTxt}>Kromium Marketing and Development Inc.  ·  Barbados</Text>
          <Text
            style={styles.footerTxt}
            render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
