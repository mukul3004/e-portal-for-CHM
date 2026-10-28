"""
=============================================================================
GANG OF FOUR (GoF) DESIGN PATTERNS PACKAGE
Project: Case Management Hearing e-Portal (Order XV-A CPC)
Course: SVVV B.Tech CSE Semester-VII Major Project (BTCS706N)
=============================================================================
This package provides formal, enterprise-grade GoF software design patterns:

1. CREATIONAL PATTERNS:
   - Singleton Pattern:
     * JudicialVaultSingleton: Thread-safe double-checked locking cryptographic vault.
     * DatabaseConnectionPoolSingleton: Thread-safe SQLAlchemy connection pool manager.
   - Factory Method / Abstract Factory Pattern:
     * CaseManagementDecree (Abstract Product)
     * CMODecreeFactory (Abstract Creator)
     * CommercialDecreeFactory, ChequeBounceDecreeFactory, SummarySuitDecreeFactory,
       ArbitrationDecreeFactory, GeneralCivilDecreeFactory (Concrete Creators)
     * DecreeFactoryProvider (Registry & Dispatcher)

2. BEHAVIORAL PATTERNS:
   - Strategy Pattern:
     * SchedulingStrategy (Abstract Strategy)
     * StrictBenchSlottingStrategy (Zero-tolerance physical court halls)
     * FlexibleBufferSlottingStrategy (Inter-bench transit buffer)
     * VirtualHybridSlottingStrategy (E-Courts VC Link mode)
     * ClashDetectionContext (Context & Runtime Policy Switcher)
=============================================================================
"""

from backend.app.patterns.singleton import (
    JudicialVaultSingleton,
    DatabaseConnectionPoolSingleton
)
from backend.app.patterns.factory import (
    CaseManagementDecree,
    CMODecreeFactory,
    CommercialDecreeFactory,
    ChequeBounceDecreeFactory,
    SummarySuitDecreeFactory,
    ArbitrationDecreeFactory,
    GeneralCivilDecreeFactory,
    DecreeFactoryProvider
)
from backend.app.patterns.strategy import (
    SchedulingStrategy,
    StrictBenchSlottingStrategy,
    FlexibleBufferSlottingStrategy,
    VirtualHybridSlottingStrategy,
    ClashDetectionContext
)

__all__ = [
    # Singleton
    "JudicialVaultSingleton",
    "DatabaseConnectionPoolSingleton",
    # Factory
    "CaseManagementDecree",
    "CMODecreeFactory",
    "CommercialDecreeFactory",
    "ChequeBounceDecreeFactory",
    "SummarySuitDecreeFactory",
    "ArbitrationDecreeFactory",
    "GeneralCivilDecreeFactory",
    "DecreeFactoryProvider",
    # Strategy
    "SchedulingStrategy",
    "StrictBenchSlottingStrategy",
    "FlexibleBufferSlottingStrategy",
    "VirtualHybridSlottingStrategy",
    "ClashDetectionContext",
]
