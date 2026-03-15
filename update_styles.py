with open('src/screens/ReportIncidentScreen.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

styles_to_add = """  coordinatesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  coordinatesInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.primary,
  },
"""

if 'coordinatesBox: {' not in text:
    text = text.replace("  textArea: {", styles_to_add + "  textArea: {")

# also remove SafeWalkMapView from imports since it causes eslint warning
text = text.replace("PrimaryButton, SafeWalkMapView", "PrimaryButton")

with open('src/screens/ReportIncidentScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("styles added")
