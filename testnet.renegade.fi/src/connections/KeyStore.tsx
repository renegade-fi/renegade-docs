import BN from "bn.js";

class RenegadeKeypair {
  // Hex of 2^255 - 19.
  static CURVE_25519_FIELD_ORDER = new BN(
    "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
    16,
  );

  _secretKey: null | BN;
  _publicKey: null | BN;

  static default() {
    return new RenegadeKeypair(null);
  }

  constructor(secretKey: null | BN) {
    if (secretKey === null) {
      this._secretKey = null;
      this._publicKey = null;
    } else {
      if (
        secretKey.lt(new BN(0)) ||
        secretKey.gt(RenegadeKeypair.CURVE_25519_FIELD_ORDER)
      ) {
        throw new Error(
          "Secret key is out of range: " + secretKey.toString(16),
        );
      }
      this._secretKey = secretKey;
      this._publicKey = RenegadeKeypair._recoverPublicKey(secretKey);
    }
  }

  signMessage(message: Uint8Array): Uint8Array {
    return message; // TODO
  }

  /**
   * Recover the public key for a given secret key.
   *
   * Use fast exponentiation to compute:
   * 2^secretKey mod (2^255 - 19)
   */
  static _recoverPublicKey(secretKey: BN): BN {
    let publicKey = new BN(1);
    // `iterativeSquareModP` keeps tracks of 2^(2^i) mod (2^255 - 19)
    let iterativeSquareModP = new BN(2);
    for (let i = 0; i < 255; i++) {
      // If the binary representation of the secret key has a 1 at this index,
      // multiply the public key by the current iterative square.
      if (secretKey.mod(new BN(2).pow(new BN(i))).eq(new BN(0))) {
        publicKey = publicKey.mul(iterativeSquareModP);
        publicKey = publicKey.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
      }
      // Advance the iterative square.
      iterativeSquareModP = iterativeSquareModP.mul(iterativeSquareModP);
      iterativeSquareModP = iterativeSquareModP.mod(
        RenegadeKeypair.CURVE_25519_FIELD_ORDER,
      );
    }
    return publicKey;
  }

  get publicKey() {
    return this._publicKey;
  }
}

class StarkNetKeypair {
  static default() {
    return new StarkNetKeypair();
  }
}

interface KeyStoreProps {}
interface KeyStoreState {
  renegadeKeypairs: { [key: string]: RenegadeKeypair };
  starkNetKeypair: StarkNetKeypair;
}
export default class KeyStore {
  props: KeyStoreProps;
  state: KeyStoreState;

  static SIGN_IN_MESSAGE = "Unlock your Renegade wallet.\nv1.0.0";

  constructor(props: KeyStoreProps) {
    this.props = props;
    this.state = {
      renegadeKeypairs: {
        root: RenegadeKeypair.default(),
        match: RenegadeKeypair.default(),
        settle: RenegadeKeypair.default(),
        view: RenegadeKeypair.default(),
      },
      starkNetKeypair: StarkNetKeypair.default(),
    };
  }

  /**
   * Given a 65-byte ECDSA signature, computes the entire Renegade key hierarchy.
   */
  async _generateRenegadeKeypairs(signatureBytes: Uint8Array): Promise<{
    [key: string]: RenegadeKeypair;
  }> {
    const signatureHash = await window.crypto.subtle.digest(
      "SHA-256",
      signatureBytes,
    );
    const signatureHashBN = new BN(new Uint8Array(signatureHash));
    const rootSecretKey = signatureHashBN.mod(
      RenegadeKeypair.CURVE_25519_FIELD_ORDER,
    );
    const root = new RenegadeKeypair(rootSecretKey);
    return {
      root,
      match: RenegadeKeypair.default(),
      settle: RenegadeKeypair.default(),
      view: RenegadeKeypair.default(),
    };
  }

  /**
   * Given a 65-byte ECDSA signature, computes the StarkNet keypair.
   */
  _generateStarkNetKeypair(signatureBytes: Uint8Array): StarkNetKeypair {
    return StarkNetKeypair.default(); // TODO
  }

  /**
   * Given a signature of the message "Unlock you Renegade wallet.\nv1.0.0",
   * populates this KeyStore with all internal Renegade key hierarchies and the
   * StarkNet key.
   */
  async populateFromSignature(signature: string) {
    if (!signature.startsWith("0x")) {
      throw new Error("Signature expected to start with 0x.");
    }
    const signatureBytes = Buffer.from(signature.slice(2), "hex");
    if (signatureBytes.length !== 65) {
      throw new Error("Signature expected to be 65 bytes.");
    }
    this.state.renegadeKeypairs = await this._generateRenegadeKeypairs(
      signatureBytes,
    );
    this.state.starkNetKeypair = this._generateStarkNetKeypair(signatureBytes);
  }
}
