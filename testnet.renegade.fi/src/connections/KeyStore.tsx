import * as ed from "@noble/ed25519";
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

  async signMessage(message: string): Promise<Uint8Array> {
    if (this._secretKey === null) {
      throw new Error("The default keypair cannot sign messages.");
    }
    const secretKeyArray = Buffer.from(this._secretKey.toArray("be", 32));
    const messageArray = Buffer.from(message, "ascii");
    const signature = await ed.sign(messageArray, secretKeyArray); // 64 bytes
    return signature;
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

  static CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade wallet.\nv1";
  static CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.\nv1";
  static CREATE_SK_SETTLE_MESSAGE = "Unlock your Renegade settle key.\nv1";
  static CREATE_SK_VIEW_MESSAGE = "Unlock your Renegade view key.\nv1";

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
   * Given an array of bytes, hash the array with SHA-256, and return the
   * resulting hash modulo Curve25519 field order.
   */
  static async _hashBytesMod25519(bytes: Uint8Array): Promise<BN> {
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    const hashBN = new BN(new Uint8Array(hash), undefined, "be");
    const hashMod25519 = hashBN.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
    return hashMod25519;
  }

  /**
   * Given a 65-byte ECDSA signature, computes the entire Renegade key hierarchy.
   */
  async _generateRenegadeKeypairs(signatureBytes: Uint8Array): Promise<{
    [key: string]: RenegadeKeypair;
  }> {
    // Deive the root key.
    const rootSecretKey = await KeyStore._hashBytesMod25519(signatureBytes);
    const root = new RenegadeKeypair(rootSecretKey);

    // Derive the match key.
    const rootSignatureBytes = await root.signMessage(
      KeyStore.CREATE_SK_MATCH_MESSAGE,
    );
    const matchSecretKey = await KeyStore._hashBytesMod25519(
      rootSignatureBytes,
    );
    const match = new RenegadeKeypair(matchSecretKey);

    // Derive the settle key.
    const matchSignatureBytes = await match.signMessage(
      KeyStore.CREATE_SK_SETTLE_MESSAGE,
    );
    const settleSecretKey = await KeyStore._hashBytesMod25519(
      matchSignatureBytes,
    );
    const settle = new RenegadeKeypair(settleSecretKey);

    // Derive the view key.
    const settleSignatureBytes = await settle.signMessage(
      KeyStore.CREATE_SK_VIEW_MESSAGE,
    );
    const viewSecretKey = await KeyStore._hashBytesMod25519(
      settleSignatureBytes,
    );
    const view = new RenegadeKeypair(viewSecretKey);

    return { root, match, settle, view };
  }

  /**
   * Given a 65-byte ECDSA signature, computes the StarkNet keypair.
   */
  _generateStarkNetKeypair(_signatureBytes: Uint8Array): StarkNetKeypair {
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
