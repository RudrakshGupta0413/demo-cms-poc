'use client'

import React, { useState, useEffect } from 'react'

interface AddressStepProps {
    onAddressSaved: (addrId: number) => void
    onBack: () => void
    userId: number
    merchantCoords: { lat: number; long: number }
}

export const AddressStep: React.FC<AddressStepProps> = ({ onAddressSaved, onBack, userId, merchantCoords }) => {
    const [step, setStep] = useState<'map' | 'details'>('map')
    const [coords, setCoords] = useState({
        lat: Number(merchantCoords?.lat) || 19.00708165220864,
        long: Number(merchantCoords?.long) || 73.11452178114182
    })
    const [mapError, setMapError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Address Details
    const [addressDetails, setAddressDetails] = useState({
        line1: '', // Flat/House No
        line2: '', // Area/Street
        line3: '', // Landmark/City/State
        postcode: '',
        name: '',
        type: 'Home' as 'Home' | 'Work' | 'Other',
        phone: ''
    })

    const fetchAddressFromCoords = async (lat: number, lng: number) => {
        setLoading(true)
        try {
            const res = await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "maps",
                    action: "getAddressByLatLong",
                    LAT: Number(lat),
                    LONG: Number(lng)
                }),
            })
            const data = await res.json()
            console.log("DEBUG: Address Lookup Response:", data);
            if (data.DATA) {
                setAddressDetails(prev => ({
                    ...prev,
                    line2: data.DATA.line2 || '',
                    line3: data.DATA.line3 || '',
                    postcode: data.DATA.postcode || ''
                }))
                setStep('details')
            } else {
                setMapError("Could not find address for this location. Please enter manually.")
            }
        } catch (err) {
            console.error("Mapping error", err)
            setMapError("Address service unavailable. Please enter manually.")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveAddress = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "address",
                    action: "create",
                    USER_ID: Number(userId),
                    ADDR_NAME: addressDetails.name,
                    ADDR_TYPE: addressDetails.type,
                    PHONE: addressDetails.phone,
                    ADDR_LN_1: addressDetails.line1,
                    ADDR_LN_2: addressDetails.line2,
                    ADDR_LN_3: addressDetails.line3,
                    POSTAL_CODE: addressDetails.postcode,
                    ADDR_LAT: Number(coords.lat),
                    ADDR_LONG: Number(coords.long),
                    ADDR_STATUS: "2"
                }),
            })
            const data = await res.json()
            console.log("DEBUG: Save Address Raw Response:", data);

            // Re-map common response formats
            const addrData = data.DATA || data;
            const finalId = addrData.ADDR_ID || addrData.id || addrData.ADDRESS_ID;

            if (finalId) {
                console.log("DEBUG: Callback onAddressSaved with ID:", finalId);
                onAddressSaved(Number(finalId))
            } else {
                const errorMsg = data.STATUS_MESSAGE || data.error || "Address ID missing in response";
                console.error("DEBUG: Address Save Failure:", data);
                setMapError(`Failed to save address: ${errorMsg}`);
                // Temporary fallback for testing if user is blocked
                // onAddressSaved(Date.now()) 
            }
        } catch (err) {
            console.error("Saving address error", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="address-step" style={{ padding: '24px' }}>
            {step === 'map' ? (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <button
                            onClick={onBack}
                            style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ←
                        </button>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Where should we deliver?</h3>
                    </div>
                    <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Use your current location or pick on map</p>

                    <div style={{
                        height: '240px',
                        background: '#f8f8f8',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ddd',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ textAlign: 'center', padding: '20px', zIndex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗺️</div>
                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                                Interactive map loaded for:<br />
                                <strong>{coords.lat.toFixed(4)}, {coords.long.toFixed(4)}</strong>
                            </p>
                            {mapError && <p style={{ color: '#c53030', fontSize: '13px', marginBottom: '16px' }}>{mapError}</p>}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                setCoords({ lat: pos.coords.latitude, long: pos.coords.longitude })
                                            })
                                        }
                                    }}
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🎯 Current Location
                                </button>
                                <button
                                    onClick={() => fetchAddressFromCoords(coords.lat, coords.long)}
                                    disabled={loading}
                                    style={{
                                        background: '#0F1111',
                                        color: '#fff',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {loading ? 'Locating...' : 'Confirm Delivery Location'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#eee', zIndex: 0 }}></div>
                        <span style={{ position: 'relative', background: '#fff', padding: '0 12px', color: '#999', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>OR</span>
                    </div>

                    <button
                        onClick={() => setStep('details')}
                        style={{
                            width: '100%',
                            background: '#fff',
                            border: '1px solid #ddd',
                            color: '#0F1111',
                            padding: '14px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Enter Address Manually
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <button
                            onClick={() => setStep('map')}
                            style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ←
                        </button>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Address Details</h3>
                    </div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>FLAT / HOUSE NO.</label>
                            <input
                                className="amazon-input"
                                value={addressDetails.line1}
                                onChange={e => setAddressDetails({ ...addressDetails, line1: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>AREA / STREET</label>
                            <input
                                className="amazon-input"
                                value={addressDetails.line2}
                                onChange={e => setAddressDetails({ ...addressDetails, line2: e.target.value })}
                                style={inputStyle}
                                placeholder="Area, Colony, Sector..."
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>LANDMARK / CITY</label>
                                <input
                                    className="amazon-input"
                                    value={addressDetails.line3}
                                    onChange={e => setAddressDetails({ ...addressDetails, line3: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Near XYZ, City Name..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>POSTCODE</label>
                                <input
                                    className="amazon-input"
                                    value={addressDetails.postcode}
                                    onChange={e => setAddressDetails({ ...addressDetails, postcode: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Zip Code"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>NAME</label>
                                <input
                                    className="amazon-input"
                                    value={addressDetails.name}
                                    onChange={e => setAddressDetails({ ...addressDetails, name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>PHONE</label>
                                <input
                                    className="amazon-input"
                                    value={addressDetails.phone}
                                    onChange={e => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#666' }}>SAVE AS</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {(['Home', 'Work', 'Other'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setAddressDetails({ ...addressDetails, type: t })}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: addressDetails.type === t ? '2px solid #000' : '1px solid #ddd',
                                            background: addressDetails.type === t ? '#f9f9f9' : '#fff',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveAddress}
                            disabled={loading || !addressDetails.line1 || !addressDetails.line2 || !addressDetails.name}
                            style={{
                                background: '#FFD814',
                                border: '1px solid #FCD200',
                                color: '#0F1111',
                                padding: '14px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                marginTop: '12px',
                                opacity: (loading || !addressDetails.line1 || !addressDetails.line2 || !addressDetails.name) ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Saving...' : 'Save and Continue'}
                        </button>
                        {mapError && step === 'details' && <p style={{ color: '#c53030', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{mapError}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none'
}
