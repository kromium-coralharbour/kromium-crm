import React from 'react'
import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer'
import { fmtFull$, fmtDate } from '@/lib/utils'
import { ProposalSection } from '@/lib/proposal-sections'

// ── Colour system ─────────────────────────────────────────────────────────────
const C = {
  navy:     '#0B0E1A',
  navyMid:  '#141929',
  orange:   '#F26419',
  white:    '#FFFFFF',
  offWhite: '#F8F9FC',
  muted:    '#6B7794',
  body:     '#1E2433',
  rule:     '#E2E5EE',
  green:    '#16A34A',
}

const styles = StyleSheet.create({
  // ── Page ──────────────────────────────────────────────────────────────────
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    color: C.body,
    paddingTop: 0,
    paddingBottom: 52,
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 9.5,
    lineHeight: 1.65,
  },

  // ── Cover / Header ─────────────────────────────────────────────────────────
  coverBlock: {
    backgroundColor: C.navy,
    paddingTop: 52,
    paddingBottom: 44,
    paddingLeft: 52,
    paddingRight: 52,
    marginBottom: 0,
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  wordmark: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 1,
  },
  wordmarkDot: {
    color: C.orange,
  },
  coverContact: {
    fontSize: 8,
    color: '#9AA0B8',
    textAlign: 'right',
    lineHeight: 1.8,
  },
  coverDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.orange,
    borderBottomStyle: 'solid',
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: -0.5,
    lineHeight: 1.2,
    marginBottom: 12,
  },
  coverMeta: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  coverMetaItem: {
    flex: 1,
  },
  coverMetaLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.orange,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  coverMetaValue: {
    fontSize: 9.5,
    color: '#EEF0F5',
    fontFamily: 'Helvetica-Bold',
  },

  // ── Services strip ─────────────────────────────────────────────────────────
  servicesStrip: {
    backgroundColor: C.orange,
    paddingVertical: 10,
    paddingHorizontal: 52,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  serviceChipText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 0.8,
  },

  // ── Body layout ────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 52,
    paddingTop: 0,
  },

  // ── Section ────────────────────────────────────────────────────────────────
  section: {
    marginTop: 26,
    marginBottom: 8,
  },
  sectionRule: {
    borderBottomWidth: 1,
    borderBottomColor: C.orange,
    borderBottomStyle: 'solid',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.orange,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 9.5,
    color: C.body,
    lineHeight: 1.75,
  },

  // ── Investment table ────────────────────────────────────────────────────────
  investBox: {
    backgroundColor: C.offWhite,
    borderLeftWidth: 3,
    borderLeftColor: C.orange,
    borderLeftStyle: 'solid',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  investHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
    borderBottomStyle: 'solid',
    paddingBottom: 6,
    marginBottom: 6,
  },
  investHeaderText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  investRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
    borderBottomStyle: 'solid',
  },
  investDesc: {
    flex: 3,
    fontSize: 9.5,
    color: C.body,
  },
  investType: {
    flex: 1,
    fontSize: 8.5,
    color: C.muted,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  investAmt: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
  },
  totalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.green,
  },

  // ── Next steps box ─────────────────────────────────────────────────────────
  nextStepsBox: {
    backgroundColor: C.navy,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  nextStepsText: {
    fontSize: 9.5,
    color: '#EEF0F5',
    lineHeight: 1.75,
  },

  // ── Terms box ──────────────────────────────────────────────────────────────
  termsBox: {
    backgroundColor: C.offWhite,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  termsText: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.7,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.rule,
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 7.5,
    color: C.muted,
  },
  footerRight: {
    fontSize: 7.5,
    color: C.muted,
  },
})

interface Props { proposal: any }

export function ProposalPDFDocument({ proposal }: Props) {
  const pricing: any[] = proposal.pricing_breakdown ?? []
  const total    = pricing.reduce((s: number, p: any) => s + (p.amount ?? 0), 0)
  const sections: ProposalSection[] = Array.isArray(proposal.sections)
    ? proposal.sections.filter((s: ProposalSection) => s.included)
    : []
  const clientName = proposal.client_company ?? proposal.clients?.company_name
    ?? (proposal.leads ? `${proposal.leads.first_name} ${proposal.leads.last_name}` : 'Valued Client')
  const clientContact = proposal.client_contact ?? ''
  const services: string[] = proposal.services ?? []

  // Render a section's body text, handling the special cases
  function renderSectionBody(section: ProposalSection) {
    if (section.id === 'investment' || section.id.startsWith('investment-')) {
      return (
        <View>
          {section.content ? <Text style={[styles.bodyText, { marginBottom: 8 }]}>{section.content}</Text> : null}
          {pricing.length > 0 ? (
            <View style={styles.investBox}>
              <View style={styles.investHeader}>
                <Text style={[styles.investHeaderText, { flex: 3 }]}>Description</Text>
                <Text style={[styles.investHeaderText, { flex: 1, textAlign: 'center' }]}>Type</Text>
                <Text style={[styles.investHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
              </View>
              {pricing.map((item: any, i: number) => (
                <View key={i} style={styles.investRow}>
                  <Text style={styles.investDesc}>{item.description}</Text>
                  <Text style={styles.investType}>{(item.type ?? '').replace(/_/g, ' ')}</Text>
                  <Text style={styles.investAmt}>{fmtFull$(item.amount ?? 0)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Investment</Text>
                <Text style={styles.totalValue}>{fmtFull$(total)}</Text>
              </View>
            </View>
          ) : null}
        </View>
      )
    }

    if (section.id === 'next-steps' || section.id.startsWith('next-steps-')) {
      return (
        <View style={styles.nextStepsBox}>
          <Text style={styles.nextStepsText}>{section.content}</Text>
        </View>
      )
    }

    if (section.id === 'terms' || section.id.startsWith('terms-')) {
      return (
        <View style={styles.termsBox}>
          <Text style={styles.termsText}>{section.content}</Text>
        </View>
      )
    }

    return <Text style={styles.bodyText}>{section.content}</Text>
  }

  return (
    <Document title={proposal.title}>
      <Page size="A4" style={styles.page}>

        {/* Cover block — navy background */}
        <View style={styles.coverBlock}>
          <View style={styles.coverTopRow}>
            <Text style={styles.wordmark}>
              KROMIUM<Text style={styles.wordmarkDot}>.</Text>
            </Text>
            <Text style={styles.coverContact}>
              info@kromiumagency.com{'\n'}
              (246) 232-1006{'\n'}
              kromiumdigital.com{'\n'}
              Barbados, Caribbean
            </Text>
          </View>

          <View style={styles.coverDivider} />

          <Text style={styles.coverTitle}>{proposal.title}</Text>

          <View style={styles.coverMeta}>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Prepared For</Text>
              <Text style={styles.coverMetaValue}>{clientName}</Text>
              {clientContact ? <Text style={{ fontSize:8.5, color:'#9AA0B8', marginTop:2 }}>{clientContact}</Text> : null}
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Date</Text>
              <Text style={styles.coverMetaValue}>{fmtDate(proposal.created_at)}</Text>
            </View>
            {proposal.valid_until ? (
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>Valid Until</Text>
                <Text style={styles.coverMetaValue}>{fmtDate(proposal.valid_until)}</Text>
              </View>
            ) : null}
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Prepared By</Text>
              <Text style={styles.coverMetaValue}>Kromium Marketing</Text>
              <Text style={{ fontSize:8.5, color:'#9AA0B8', marginTop:2 }}>& Development Inc.</Text>
            </View>
          </View>
        </View>

        {/* Services strip — orange bar */}
        {services.length > 0 && (
          <View style={styles.servicesStrip}>
            {services.map((s: string) => (
              <View key={s} style={styles.serviceChip}>
                <Text style={styles.serviceChipText}>{s.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Body sections */}
        <View style={styles.body}>
          {sections.map((section: ProposalSection) => (
            <View key={section.id} style={styles.section} wrap={false}>
              <View style={styles.sectionRule} />
              <Text style={styles.sectionLabel}>{section.title.toUpperCase()}</Text>
              {renderSectionBody(section)}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>
            Kromium Marketing and Development Inc. — Barbados, Caribbean — Confidential
          </Text>
          <Text
            style={styles.footerRight}
            render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  )
}
